
import { Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../types';

export const getBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT b.*, d.name as domain_name 
      FROM blogs b 
      LEFT JOIN domains d ON b.domain_id = d.id 
      ORDER BY b.created_at DESC
    `);
    res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch blogs' });
  }
};

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, content, excerpt, domain_id, status } = req.body;
    const author_id = req.user?.id || 1; // Fallback to 1 for now until auth middleware is updated

    if (!title || !slug || !content || !domain_id) {
      return res.status(400).json({ status: 'error', message: 'Title, slug, content and domain are required' });
    }

    const result = await query(
      `INSERT INTO blogs (title, slug, content, excerpt, domain_id, author_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, slug, content, excerpt, domain_id, author_id, status || 'draft']
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ status: 'error', message: 'A blog with this slug already exists' });
    }
    res.status(500).json({ status: 'error', message: 'Failed to create blog' });
  }
};
