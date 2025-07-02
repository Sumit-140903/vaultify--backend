// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/profile', verifyToken, getProfile);

export default router;
