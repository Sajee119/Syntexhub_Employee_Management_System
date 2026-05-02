import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadDocument, getEmployeeDocuments, deleteDocument, generateSalarySlip } from '../controllers/documentController.js';
import { protect } from '../middleware/errorHandler.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/employee/:employeeId', protect, upload.single('file'), uploadDocument);
router.get('/employee/:employeeId', protect, getEmployeeDocuments);
router.delete('/:id', protect, deleteDocument);
router.post('/salary-slip/:employeeId', protect, generateSalarySlip);

export default router;
