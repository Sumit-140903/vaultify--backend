// routes/adminRoutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import AccessRequest from '../models/AccessRequest.js';

const router = express.Router();

// Admin-only stats route
router.get('/stats', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const users = await User.countDocuments();
    const documents = await Document.countDocuments();
    const requests = await AccessRequest.countDocuments();

    res.json({ users, documents, requests });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin stats', error: err.message });
  }
});

export default router;
