// app.js (ESM version)
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Vaultify Backend API is running');
});

export default app;
