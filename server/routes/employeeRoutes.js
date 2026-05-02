import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  bulkDeleteEmployees,
  bulkUpdateStatus,
  sendEmployeeEmail,
  getActivityLogs
} from '../controllers/employeeController.js';
import { validate, protect } from '../middleware/errorHandler.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

const employeeValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('role').notEmpty().withMessage('Role is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('salary').isNumeric({ min: 0 }).withMessage('Salary must be a positive number'),
  body('status').optional().isIn(['Active', 'Inactive'])
];

router.get('/', protect, getEmployees);
router.get('/activity-logs', protect, getActivityLogs);
router.get('/:id', protect, getEmployeeById);
router.post('/', protect, upload.single('profilePicture'), employeeValidation, validate, createEmployee);
router.put('/:id', protect, upload.single('profilePicture'), updateEmployee);
router.delete('/:id', protect, deleteEmployee);
router.post('/bulk-delete', protect, bulkDeleteEmployees);
router.post('/bulk-update-status', protect, bulkUpdateStatus);
router.post('/:id/send-email', protect, sendEmployeeEmail);

export default router;
