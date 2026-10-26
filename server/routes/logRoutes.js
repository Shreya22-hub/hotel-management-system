import express from 'express';
import { Log } from '../models/Log.js';
import { authGuard } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Get all logs (All authenticated staff)
router.get('/', authGuard, async (req, res) => {
  try {
    const logs = await Log.find().sort({ id: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new log
router.post('/', authGuard, async (req, res) => {
  try {
    const { message, category } = req.body;
    if (!message) return res.status(400).json({ message: 'Log message is required.' });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog = await Log.create({
      id: Date.now(),
      author: `${req.user.name} (${req.user.designation})`,
      time: timeStr,
      category: category || 'General',
      message
    });

    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
