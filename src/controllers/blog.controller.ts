
import { Request, Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../types';

/**
 * Admin: Get all blogs (including drafts)
 */
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

/**
 * Admin: Create a new blog
 */
export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, content, excerpt, domain_id, status } = req.body;
    const author_id = req.user?.id || 1;

    console.log('Create Blog Payload Received:', req.body);

    if (!title) return res.status(400).json({ status: 'error', message: 'Title is required' });
    if (!slug) return res.status(400).json({ status: 'error', message: 'Slug is required' });
    if (!content) return res.status(400).json({ status: 'error', message: 'Content is required' });
    if (!domain_id) return res.status(400).json({ status: 'error', message: 'Domain ID is required' });

    const parsedDomainId = parseInt(domain_id.toString());
    if (isNaN(parsedDomainId)) return res.status(400).json({ status: 'error', message: 'Invalid Domain ID' });

    const result = await query(
      `INSERT INTO blogs (title, slug, content, excerpt, domain_id, author_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, slug, content, excerpt, parsedDomainId, author_id, status || 'draft']
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ status: 'error', message: 'A blog with this slug already exists' });
    }
    res.status(500).json({ status: 'error', message: 'Failed to create blog' });
  }
};


/**
 * Public: Get blogs for a specific domain with pagination
 * Query params: ?page=1&limit=10
 */
export const getPublicBlogsByDomain = async (req: Request, res: Response) => {
  try {
    const { domain_id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // 1. Get total count for pagination metadata
    const countResult = await query(
      'SELECT COUNT(*) FROM blogs WHERE domain_id = $1 AND status = $2',
      [domain_id, 'published']
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // 2. Fetch paginated blogs
    const result = await query(`
      SELECT id, title, slug, excerpt, featured_image, created_at 
      FROM blogs 
      WHERE domain_id = $1 AND status = 'published'
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [domain_id, limit, offset]);

    res.status(200).json({
      status: 'success',
      data: result.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch domain blogs' });
  }
};

/**
 * Public: Get blog detail by slug with recommended posts
 */
export const getPublicBlogDetail = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // 1. Fetch main blog
    const blogResult = await query(`
      SELECT b.*, d.name as domain_name, d.url as domain_url
      FROM blogs b
      JOIN domains d ON b.domain_id = d.id
      WHERE b.slug = $1 AND b.status = 'published'
    `, [slug]);

    if (blogResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Blog not found' });
    }

    const blog = blogResult.rows[0];

    // 2. Fetch recommended blogs (same domain, excluding current)
    const recommendedResult = await query(`
      SELECT id, title, slug, excerpt, featured_image, created_at
      FROM blogs
      WHERE domain_id = $1 AND status = 'published' AND id != $2
      ORDER BY created_at DESC
      LIMIT 3
    `, [blog.domain_id, blog.id]);

    res.status(200).json({
      status: 'success',
      data: {
        blog,
        recommended: recommendedResult.rows
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch blog details' });
  }
};
