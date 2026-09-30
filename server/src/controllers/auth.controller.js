import bcrypt from 'bcrypt';
import { z } from 'zod';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, setAuthCookies } from '../utils/tokens.js';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import sendEmail from '../utils/sendEmail.js';

const registerSchema = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.email(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
  }
  const { name, email, password } = parsed.data;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  setAuthCookies(res, signAccessToken(user.id), signRefreshToken(user.id));
  res.status(201).json({ user: publicUser(user) });
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const { email, password } = parsed.data;

  const user = await User.findOne({ email: email.toLowerCase() });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

  setAuthCookies(res, signAccessToken(user.id), signRefreshToken(user.id));
  res.json({ user: publicUser(user) });
}

export async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ error: 'User not found' });

  setAuthCookies(res, signAccessToken(user.id), signRefreshToken(user.id));
  res.json({ user: publicUser(user) });
}

export function logout(req, res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  res.json({ ok: true });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
}

const forgotSchema = z.object({ email: z.email() });
const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(100),
});

const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');

export async function forgotPassword(req, res) {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetTokenHash = hashToken(token);
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset your Duely password',
        text: `Reset your password using this link (valid for 30 minutes):\n${link}\n\nIf you didn't ask for this, ignore this email.`,
        html: `<p>Reset your password using the link below (valid for 30 minutes).</p><p><a href="${link}">Reset password</a></p><p>If you didn't ask for this, ignore this email.</p>`,
      });
    } catch (err) {
      console.error('Reset email failed:', err.message);
    }
  }

  // Same answer whether or not the email exists
  res.json({ message: 'If that email is registered, a reset link has been sent.' });
}

export async function resetPassword(req, res) {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
  }
  const { token, password } = parsed.data;

  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) return res.status(400).json({ error: 'Reset link is invalid or has expired' });

  user.passwordHash = await bcrypt.hash(password, 12);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  res.json({ ok: true });
}