
import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import domainRoutes from './domain.routes';
import blogRoutes from './blog.routes';
import leadRoutes from './lead.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/domains', domainRoutes);
router.use('/blogs', blogRoutes);
router.use('/leads', leadRoutes);

export default router;
