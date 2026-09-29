import bcrypt from 'bcrypt';
import { z } from 'zod';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, setAuthCookies } from '../utils/tokens.js';

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