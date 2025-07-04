import { Web3Storage, File } from 'web3.storage';
import { keccak256, toUtf8Bytes } from 'ethers';
import contract from '../config/contract.js';
import Document from '../models/Document.js';

export async function uploadDocument(req, res) {
  try {
    const { title, contentBase64 } = req.body;

    console.log('📥 Upload Request Body:', req.body);
    if (!title || !contentBase64 || typeof contentBase64 !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid title or contentBase64',
      });
    }

    // ✅ Extract MIME type and base64 string
    let mimeType = 'image/png'; // default fallback
    let base64Data = '';

    try {
      if (contentBase64.includes(',')) {
        const [meta, data] = contentBase64.split(',');
        base64Data = data;

        const mimeMatch = meta.match(/data:(.*);base64/);
        if (mimeMatch && mimeMatch[1]) {
          mimeType = mimeMatch[1];
        }
      } else {
        base64Data = contentBase64;
      }
    } catch (err) {
      console.error('❌ Failed to extract base64 or MIME type:', err.message);
      return res.status(400).json({
        error: 'Invalid base64 input',
        details: err.message,
      });
    }

    console.log('✅ MIME Type:', mimeType);
    console.log('✅ Base64 Extracted:', base64Data.substring(0, 30) + '...');

    const buffer = Buffer.from(base64Data, 'base64');

    // ✅ Determine file extension
    const extension = mimeType.split('/')[1] || 'png';

    const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });
    const file = new File([buffer], `${title}.${extension}`, { type: mimeType });
    const cid = await client.put([file]);

    const hash = keccak256(toUtf8Bytes(cid));
    const tx = await contract.storeDocumentHash(hash);
    await tx.wait();

    const newDoc = new Document({
      title,
      cid,
      hash,
      owner: req.user.id,
    });

    await newDoc.save();

    res.json({
      message: 'Image uploaded successfully',
      cid,
      hash,
    });

  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    res.status(500).json({
      error: 'Upload failed',
      details: err.message,
    });
  }
}
