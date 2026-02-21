import { Router } from 'express';
import { getLeads, createOrUpdateLead } from '../controllers/lead.controller';
import { auth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', auth, requireAdmin, getLeads);
router.post('/', createOrUpdateLead); // webhook, likely doesn't need admin

export default router;
