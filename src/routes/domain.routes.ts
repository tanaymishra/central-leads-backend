
import { Router } from 'express';
import { getDomains, createDomain } from '../controllers/domain.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', auth, getDomains);
router.post('/', auth, createDomain);

export default router;
