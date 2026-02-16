
import { Router } from 'express';
import { getLeads, createOrUpdateLead } from '../controllers/lead.controller';

const router = Router();

router.get('/', getLeads);
router.post('/', createOrUpdateLead);

export default router;
