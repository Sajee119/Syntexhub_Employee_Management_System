import express from 'express';
import { body } from 'express-validator';
import { getRoles, getRoleById, createRole, updateRole, deleteRole } from '../controllers/roleController.js';
import { validate, protect } from '../middleware/errorHandler.js';

const router = express.Router();

const roleValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().trim()
];

router.get('/', protect, getRoles);
router.get('/:id', protect, getRoleById);
router.post('/', protect, roleValidation, validate, createRole);
router.put('/:id', protect, roleValidation, validate, updateRole);
router.delete('/:id', protect, deleteRole);

export default router;
