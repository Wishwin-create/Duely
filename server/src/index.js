import 'dotenv/config';
import dns from 'node:dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/v1/health', (req, res) => res.json({ ok: true }));
app.use('/api/v1/auth', authRoutes);

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT, () =>
  console.log(`API running on :${process.env.PORT}`)
);