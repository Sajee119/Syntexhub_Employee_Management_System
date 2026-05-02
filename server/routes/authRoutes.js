import express from 'express';
import { body } from 'express-validator';
import { login, getProfile, verify2FA } from '../controllers/authController.js';
import { validate, protect } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], validate, login);

router.post('/verify-2fa', [
  body('passkey').notEmpty()
], validate, verify2FA);

router.get('/profile', protect, getProfile);

export default router;
