import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  guest: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  room: { type: Number, required: true },
  checkin: { type: String, required: true },
  checkout: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['confirmed', 'checked-in', 'checked-out', 'pending', 'cancelled'],
    default: 'confirmed' 
  },
  guestsCount: { type: Number, default: 2 },
  totalAmount: { type: Number, required: true },
  idType: { type: String, default: 'Aadhaar Card' },
  idNumber: { type: String, default: 'Verified on Arrival' },
  idVerified: { type: Boolean, default: true },
  notes: { type: String, default: '' },
  cancellationReason: { type: String, default: '' },
  cancelledAt: { type: String, default: null }
}, {
  timestamps: true
});

export const Reservation = mongoose.model('Reservation', reservationSchema);
