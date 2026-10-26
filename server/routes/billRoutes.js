import express from 'express';
import { Bill } from '../models/Bill.js';
import { Log } from '../models/Log.js';
import { authGuard, roleGuard } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Get all bills (Admin & Reception only - Housekeeping strictly forbidden)
router.get('/', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const bills = await Bill.find().sort({ id: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle bill status
router.patch('/:id/status', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const billId = parseInt(req.params.id);
    const bill = await Bill.findOne({ id: billId });
    if (!bill) return res.status(404).json({ message: 'Bill folio not found' });

    bill.status = bill.status === 'paid' ? 'pending' : 'paid';
    await bill.save();

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add extra charge (In-Room dining, spa, chauffeur)
router.post('/:id/extra-charge', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { description, amount } = req.body;

    if (!description || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Valid description and positive amount are required.' });
    }

    const bill = await Bill.findOne({ id: billId });
    if (!bill) return res.status(404).json({ message: 'Bill folio not found' });

    const chargeAmount = parseFloat(amount);
    const newExtra = bill.extraCharges + chargeAmount;
    const newTaxes = Math.round((bill.roomCharges + newExtra) * 0.12);
    const newTotal = bill.roomCharges + newExtra + newTaxes;

    bill.extraCharges = newExtra;
    bill.taxes = newTaxes;
    bill.total = newTotal;
    bill.items.push({
      id: Date.now(),
      description,
      amount: chargeAmount,
      date: new Date().toISOString().split('T')[0]
    });

    await bill.save();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await Log.create({
      id: Date.now(),
      author: `${req.user.name} (${req.user.designation})`,
      time: timeStr,
      category: 'Front Desk',
      message: `Added ₹${chargeAmount.toLocaleString('en-IN')} charge (${description}) to Room ${bill.room} Folio #${bill.id}`
    });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
