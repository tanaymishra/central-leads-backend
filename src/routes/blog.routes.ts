
import { Router } from 'express';
import { getBlogs, createBlog } from '../controllers/blog.controller';

const router = Router();

router.get('/', getBlogs);
router.post('/', createBlog);

export default router;
