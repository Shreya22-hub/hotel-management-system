import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
  id: { type: Number, default: () => Date.now() },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const billSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  resId: { type: Number, required: true },
  guest: { type: String, required: true },
  room: { type: Number, required: true },
  roomCharges: { type: Number, required: true },
  extraCharges: { type: Number, default: 0 },
  taxes: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  paymentMethod: { type: String, default: 'UPI / Credit Card Pre-auth' },
  date: { type: String, required: true },
  items: [billItemSchema]
}, {
  timestamps: true
});

export const Bill = mongoose.model('Bill', billSchema);
