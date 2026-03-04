import { Router } from 'express';
import { getDomains, createDomain } from '../controllers/domain.controller';
import { auth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', auth, getDomains);
router.post('/', auth, requireAdmin, createDomain);

export default router;