import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  min: { type: Number, required: true, default: 10 },
  unit: { type: String, default: 'sets' },
  costPerUnit: { type: Number, required: true, default: 100 }
}, {
  timestamps: true
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
