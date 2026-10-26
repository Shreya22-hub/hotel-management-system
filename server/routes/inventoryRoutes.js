import express from 'express';
import { Inventory } from '../models/Inventory.js';
import { Log } from '../models/Log.js';
import { authGuard, roleGuard } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Get all inventory (All authenticated staff)
router.get('/', authGuard, async (req, res) => {
  try {
    const items = await Inventory.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Adjust quantity
router.patch('/:id/adjust', authGuard, roleGuard('admin', 'reception', 'housekeeping'), async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { delta } = req.body;

    const item = await Inventory.findOne({ id: itemId });
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });

    item.quantity = Math.max(0, item.quantity + (parseInt(delta) || 0));
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Restock
router.post('/:id/restock', authGuard, roleGuard('admin', 'reception', 'housekeeping'), async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const item = await Inventory.findOne({ id: itemId });
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });

    const restockQty = item.min * 2;
    item.quantity += restockQty;
    await item.save();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await Log.create({
      id: Date.now(),
      author: `${req.user.name} (${req.user.designation})`,
      time: timeStr,
      category: 'Housekeeping',
      message: `Restocked +${restockQty} units of ${item.name}`
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
