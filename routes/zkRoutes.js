import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const snarkjs = require('snarkjs');

const router = express.Router();

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/verify-proof', async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;

    if (!proof || !publicSignals) {
      return res.status(400).json({ success: false, message: 'Missing proof or publicSignals' });
    }

    const vKeyPath = path.join(__dirname, '../build/verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vKeyPath, 'utf8'));

    const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (verified) {
      res.json({ success: true, message: '✅ Valid ZKP Proof' });
    } else {
      res.status(400).json({ success: false, message: '❌ Invalid ZKP Proof' });
    }
  } catch (error) {
    console.error('ZKP Verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during ZKP verification' });
  }
});

export default router;
