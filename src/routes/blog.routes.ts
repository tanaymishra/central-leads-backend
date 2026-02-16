
import { Router } from 'express';
import {
    getBlogs,
    createBlog,
    getPublicBlogsByDomain,
    getPublicBlogDetail
} from '../controllers/blog.controller';

const router = Router();

// Admin routes
router.get('/', getBlogs);
router.post('/', createBlog);

// Public routes for external integration
router.get('/public/domain/:domain_id', getPublicBlogsByDomain);
router.get('/public/post/:slug', getPublicBlogDetail);

export default router;
