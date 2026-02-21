import { Router } from 'express';
import { createWriter, getWriters } from '../controllers/user.controller';
import { auth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/writers', auth, requireAdmin, createWriter);
router.get('/writers', auth, requireAdmin, getWriters);

export default router;
