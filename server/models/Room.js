import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  number: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  category: { type: String, required: true, enum: ['Single', 'Double', 'Suite'] },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['available', 'occupied', 'cleaning', 'maintenance'],
    default: 'available' 
  },
  floor: { type: Number, required: true },
  beds: { type: String, default: '1 King Bed' },
  size: { type: String, default: '450 sq ft' },
  amenities: [{ type: String }],
  lastCleaned: { type: String, default: '2026-10-24 10:00' },
  supervisorNote: { type: String, default: '' }
}, {
  timestamps: true
});

export const Room = mongoose.model('Room', roomSchema);
