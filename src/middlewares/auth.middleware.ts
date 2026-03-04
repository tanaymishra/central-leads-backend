import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { query } from '../config/db';
import { AuthRequest } from '../types';

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (!token && !apiKey) {
        return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, config.jwtSecret) as any;
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
        }
    }

    if (apiKey) {
        try {
            const result = await query('SELECT * FROM domains WHERE api_key = $1', [apiKey as string]);
            if (result.rows.length === 0) {
                return res.status(401).json({ status: 'error', message: 'Invalid API Key' });
            }
            const domain = result.rows[0];
            // Use a dummy user associated with the API key or set basic permissions
            req.user = { id: 1, email: 'api@domain.com', name: 'API User', role: 'WRITER', domain_id: domain.id };
            return next();
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to verify API key' });
        }
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Admin access only' });
    }
    next();
};
