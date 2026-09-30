import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout, me } from '../controllers/auth.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;