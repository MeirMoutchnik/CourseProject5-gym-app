import { Router } from 'express';
import { getLessons, getLesson, createLesson, updateLesson, deleteLesson } from '../controllers/LessonsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createLesson);
router.get('/:branch_code', getLessons);
router.get('/:branch_code/:lesson_code', getLesson);
router.put('/:branch_code/:lesson_code', authenticateToken, updateLesson);
router.delete('/:branch_code/:lesson_code', authenticateToken, deleteLesson);

export default router;