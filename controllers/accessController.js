const AccessRequest = require('../models/AccessRequest');

// Request access to a document
exports.requestAccess = async (req, res) => {
  const documentId = req.params.documentId;

  try {
    const request = await AccessRequest.create({
      document: documentId,
      requester: req.user.id,
      status: 'pending',
    });

    res.status(201).json({ message: 'Request submitted', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Resident: view own access requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find({ requester: req.user.id })
      .populate('document', 'title ipfsUrl');

    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: view pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    const pending = await AccessRequest.find({ status: 'pending' })
      .populate('requester', 'name email')
      .populate('document', 'title');

    res.status(200).json({ pending });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: approve access
exports.approveRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await AccessRequest.findByIdAndUpdate(
      requestId,
      { status: 'approved' },
      { new: true }
    );
    res.status(200).json({ message: 'Request approved', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: reject access
exports.rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await AccessRequest.findByIdAndUpdate(
      requestId,
      { status: 'rejected' },
      { new: true }
    );
    res.status(200).json({ message: 'Request rejected', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
