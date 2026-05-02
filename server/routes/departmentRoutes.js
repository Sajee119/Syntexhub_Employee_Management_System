import express from 'express';
import { body } from 'express-validator';
import { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { validate, protect } from '../middleware/errorHandler.js';

const router = express.Router();

const departmentValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().trim()
];

router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartmentById);
router.post('/', protect, departmentValidation, validate, createDepartment);
router.put('/:id', protect, departmentValidation, validate, updateDepartment);
router.delete('/:id', protect, deleteDepartment);

export default router;
