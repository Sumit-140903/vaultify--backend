const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  requestAccess,
  getMyRequests,
  getPendingRequests,
  approveRequest,
  rejectRequest
} = require('../controllers/accessController');

// Resident: request access
router.post('/request/:documentId', verifyToken, requestAccess);

// Resident: view own requests
router.get('/my-requests', verifyToken, getMyRequests);

// Admin: view all pending
router.get('/pending', verifyToken, getPendingRequests);

// Admin: approve
router.post('/approve/:requestId', verifyToken, approveRequest);

// Admin: reject
router.post('/reject/:requestId', verifyToken, rejectRequest);

module.exports = router;
