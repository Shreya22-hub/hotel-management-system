import express from 'express';
import { seedDatabase } from '../seedDatabase.js';
import { authGuard, roleGuard } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Only General Manager / Admin can trigger factory database reset
router.post('/reset', authGuard, roleGuard('admin'), async (req, res) => {
  try {
    await seedDatabase(true);
    res.json({ success: true, message: 'Database reset to Rajvilas Heritage Palace factory default records.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
