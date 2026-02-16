
import { Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../types';

export const getDomains = async (req: AuthRequest, res: Response) => {
    try {
        const result = await query('SELECT * FROM domains ORDER BY created_at DESC');
        res.status(200).json({ status: 'success', data: result.rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch domains' });
    }
};

export const createDomain = async (req: AuthRequest, res: Response) => {
    try {
        const { name, url, api_key } = req.body;
        if (!name || !url) {
            return res.status(400).json({ status: 'error', message: 'Name and URL are required' });
        }
        const result = await query(
            'INSERT INTO domains (name, url, api_key) VALUES ($1, $2, $3) RETURNING *',
            [name, url, api_key]
        );
        res.status(201).json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create domain' });
    }
};
