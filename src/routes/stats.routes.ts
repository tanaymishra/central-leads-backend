import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { auth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', auth, requireAdmin, getDashboardStats);

export default router;
