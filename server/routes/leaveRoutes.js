import express from 'express';
import { applyLeave, getLeaves, updateLeaveStatus, deleteLeave } from '../controllers/leaveController.js';
import { protect } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/', protect, getLeaves);
router.put('/:id/status', protect, updateLeaveStatus);
router.delete('/:id', protect, deleteLeave);

export default router;
