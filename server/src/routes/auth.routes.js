import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
const forgotLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5 });

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.post('/forgot-password', forgotLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

export default router;