import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import uploadRoutes from './routes/uploadRoutes.js';
import zkRoutes from './routes/zkRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // For large base64 payloads

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vaultify';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/zk', zkRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Vaultify backend is running');
});

// Server Start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Vaultify backend running on port ${PORT}`);
});
