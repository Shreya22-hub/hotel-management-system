import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  id: { type: Number, required: true, default: () => Date.now() },
  author: { type: String, required: true },
  time: { type: String, required: true },
  category: { type: String, default: 'General' },
  message: { type: String, required: true }
}, {
  timestamps: true
});

export const Log = mongoose.model('Log', logSchema);
