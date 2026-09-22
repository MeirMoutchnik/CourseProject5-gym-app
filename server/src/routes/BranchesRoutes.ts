import { Router } from 'express';
import { getBranches } from '../controllers/BranchesContgroller';

const router = Router();

router.get('/', getBranches);

export default router;