
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest } from '../types';

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as any;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Admin access only' });
    }
    next();
};
