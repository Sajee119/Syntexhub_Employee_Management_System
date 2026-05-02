import express from 'express';
import { body } from 'express-validator';
import { getTransfers, createTransfer, updateTransferStatus, deleteTransfer, getEmployeeTransfers } from '../controllers/transferController.js';
import { validate, protect } from '../middleware/errorHandler.js';

const router = express.Router();

const transferValidation = [
  body('employee').notEmpty().withMessage('Employee is required'),
  body('fromDepartment').notEmpty(),
  body('toDepartment').notEmpty(),
  body('reason').notEmpty()
];

router.get('/', protect, getTransfers);
router.get('/employee/:employeeId', protect, getEmployeeTransfers);
router.post('/', protect, transferValidation, validate, createTransfer);
router.put('/:id/status', protect, updateTransferStatus);
router.delete('/:id', protect, deleteTransfer);

export default router;
