import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../config/db';

export const createWriter = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ status: 'error', message: 'Name, email and password are required' });
        }

        // Check if user already exists
        const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ status: 'error', message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
            [email, hashedPassword, name, 'writer']
        );

        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create writer error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const getWriters = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT id, email, name, role, created_at FROM users WHERE role = $1 ORDER BY created_at DESC', ['writer']);

        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (error) {
        console.error('Get writers error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
