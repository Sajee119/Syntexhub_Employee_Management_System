import express from 'express';
import { body } from 'express-validator';
import { getReviews, getReviewById, createReview, updateReview, deleteReview, getEmployeeReviews } from '../controllers/performanceController.js';
import { validate, protect } from '../middleware/errorHandler.js';

const router = express.Router();

const reviewValidation = [
  body('employee').notEmpty().withMessage('Employee is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('period.start').isDate().withMessage('Start date required'),
  body('period.end').isDate().withMessage('End date required')
];

router.get('/', protect, getReviews);
router.get('/employee/:employeeId', protect, getEmployeeReviews);
router.get('/:id', protect, getReviewById);
router.post('/', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, reviewValidation, validate, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
