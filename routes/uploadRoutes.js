// routes/uploadRoutes.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  uploadDocument,
  getDocuments,
  requestAccess,
  getAccessRequests,
  approveAccess
} from '../controllers/documentController.js';

const router = express.Router();

// 📥 Upload a document
router.post('/upload', verifyToken, uploadDocument);

// 📄 Get all documents uploaded by the logged-in user
router.get('/my-documents', verifyToken, getDocuments);

// 🔐 Request access to a specific document
router.post('/request-access', verifyToken, requestAccess);

// 🧑‍⚖️ Admin: Get all access requests
router.get('/access-requests', verifyToken, getAccessRequests);

// ✅ Admin: Approve a document access request
router.post('/approve-access', verifyToken, approveAccess);

export default router;
