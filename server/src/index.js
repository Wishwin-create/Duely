import 'dotenv/config';
import dns from 'node:dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/v1/health', (req, res) => res.json({ ok: true }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed. Check your Atlas whitelist and MONGO_URI.');
    console.error(error.message);
<<<<<<< HEAD
    console.error('Starting the API without the database connection for local development.');
=======
    process.exit(1);
>>>>>>> 605632cf108d652354386336a00c6d0dffe0c91b
  }

  app.listen(port, () => {
    console.log(`API running on :${port}`);
  });
}

startServer();