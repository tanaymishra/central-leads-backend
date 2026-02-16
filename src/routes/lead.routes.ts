
import { Router } from 'express';
import { getLeads, createOrUpdateLead } from '../controllers/lead.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', auth, getLeads);
router.post('/', createOrUpdateLead);

export default router;
