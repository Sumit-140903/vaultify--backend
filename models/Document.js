// models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ipfsCid: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
