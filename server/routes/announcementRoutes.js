import express from 'express';
import { body } from 'express-validator';
import { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement, getActiveAnnouncements } from '../controllers/announcementController.js';
import { validate, protect } from '../middleware/errorHandler.js';

const router = express.Router();

const announcementValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];

router.get('/', protect, getAnnouncements);
router.get('/active', protect, getActiveAnnouncements);
router.get('/:id', protect, getAnnouncementById);
router.post('/', protect, announcementValidation, validate, createAnnouncement);
router.put('/:id', protect, announcementValidation, validate, updateAnnouncement);
router.delete('/:id', protect, deleteAnnouncement);

export default router;
