import jwt from 'jsonwebtoken';

export default function requireAuth(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
}