import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'reception', 'housekeeping'] },
  designation: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'VR' }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
