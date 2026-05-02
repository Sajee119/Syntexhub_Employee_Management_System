import express from 'express';
import { markAttendance, getAttendance, checkout, generateReport } from '../controllers/attendanceController.js';
import { protect } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/mark', protect, markAttendance);
router.get('/', protect, getAttendance);
router.put('/:id/checkout', protect, checkout);
router.get('/report', protect, generateReport);

export default router;
