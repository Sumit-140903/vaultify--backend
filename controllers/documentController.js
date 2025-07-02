import { create } from '@web3-storage/w3up-client';
import { File } from 'web3.storage';
import { keccak256 } from 'ethers';
import Document from '../models/Document.js';
import AccessRequest from '../models/AccessRequest.js';
import contract from '../config/contract.js';

// 📥 Upload document
export async function uploadDocument(req, res) {
  try {
    const { title, contentBase64 } = req.body;

    if (!title || !contentBase64) {
      return res.status(400).json({ error: 'Title and base64 content required' });
    }

    const buffer = Buffer.from(contentBase64, 'base64');
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const file = new File([buffer], `${sanitizedTitle}.pdf`, { type: 'application/pdf' });

    const client = await create();
    await client.login(process.env.WEB3_STORAGE_EMAIL);
    await client.setCurrentSpace(process.env.WEB3_STORAGE_SPACE);

    const cid = await client.uploadFile(file);

    const hash = keccak256(buffer);
    const tx = await contract.storeDocumentHash(hash);
    const receipt = await tx.wait();
    if (receipt.status !== 1) throw new Error('Transaction reverted');

    const newDoc = await Document.create({
      title: sanitizedTitle,
      owner: req.user.id,
      ipfsCid: cid.toString(),
      hash,
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      cid: cid.toString(),
      hash,
      txHash: receipt.transactionHash,
      doc: newDoc
    });

  } catch (err) {
    console.error('❌ Upload error:', err.stack);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
}

// 📄 Get documents uploaded by the user
export async function getDocuments(req, res) {
  try {
    const documents = await Document.find({ owner: req.user.id });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
}

// 🔐 Request access to a document
export async function requestAccess(req, res) {
  try {
    const { documentId } = req.body;
    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const existing = await AccessRequest.findOne({
      document: documentId,
      requester: req.user.id,
    });

    if (existing) return res.status(400).json({ message: 'Access request already sent' });

    const request = await AccessRequest.create({
      document: documentId,
      requester: req.user.id,
      owner: doc.owner,
    });

    res.status(201).json({ message: 'Access request sent', request });
  } catch (err) {
    res.status(500).json({ error: 'Failed to request access', details: err.message });
  }
}

// 🧑‍⚖️ Admin: Get all access requests
export async function getAccessRequests(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view access requests' });
    }

    const requests = await AccessRequest.find().populate('document requester');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch access requests' });
  }
}

// ✅ Approve access request
export async function approveAccess(req, res) {
  try {
    const { requestId } = req.body;
    const request = await AccessRequest.findByIdAndUpdate(
      requestId,
      { status: 'approved' },
      { new: true }
    );

    if (!request) return res.status(404).json({ error: 'Access request not found' });

    res.json({ message: 'Access request approved', request });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve request', details: err.message });
  }
}
