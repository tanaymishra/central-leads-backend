
import { Router } from 'express';
import {
    getBlogs,
    createBlog,
    getPublicBlogsByDomain,
    getPublicBlogDetail
} from '../controllers/blog.controller';

import { auth } from '../middlewares/auth.middleware';

const router = Router();

// Admin routes
router.get('/', auth, getBlogs);
router.post('/', auth, createBlog);

// Public routes for external integration
router.get('/public/domain/:domain_id', getPublicBlogsByDomain);
router.get('/public/post/:slug', getPublicBlogDetail);

export default router;
