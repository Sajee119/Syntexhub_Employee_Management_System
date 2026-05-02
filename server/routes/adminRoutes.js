import express from 'express';
import { body } from 'express-validator';
import { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController.js';
import { validate, protect } from '../middleware/errorHandler.js';

const router = express.Router();

const adminValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

router.get('/', protect, getAdmins);
router.get('/:id', protect, getAdminById);
router.post('/', protect, adminValidation, validate, createAdmin);
router.put('/:id', protect, adminValidation, validate, updateAdmin);
router.delete('/:id', protect, deleteAdmin);

export default router;
