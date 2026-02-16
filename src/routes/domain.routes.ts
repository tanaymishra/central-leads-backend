
import { Router } from 'express';
import { getDomains, createDomain } from '../controllers/domain.controller';

const router = Router();

router.get('/', getDomains);
router.post('/', createDomain);

export default router;
