import express from 'express';
import { Room } from '../models/Room.js';
import { Log } from '../models/Log.js';
import { authGuard, roleGuard } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Get all rooms (Accessible by authenticated staff)
router.get('/', authGuard, async (req, res) => {
  try {
    const rooms = await Room.find().sort({ number: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update room status
router.patch('/:id/status', authGuard, roleGuard('admin', 'reception', 'housekeeping'), async (req, res) => {
  try {
    const { status } = req.body;
    const room = await Room.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await Log.create({
      id: Date.now(),
      author: `${req.user.name} (${req.user.designation})`,
      time: timeStr,
      category: 'Housekeeping',
      message: `Room ${room.number} status updated to ${status.toUpperCase()}`
    });

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4-Point Supervisor Inspection & Turnover completion
router.post('/:number/inspect', authGuard, roleGuard('admin', 'housekeeping'), async (req, res) => {
  try {
    const { notes } = req.body;
    const roomNumber = parseInt(req.params.number);
    const room = await Room.findOneAndUpdate(
      { number: roomNumber },
      { 
        status: 'available', 
        lastCleaned: new Date().toISOString().replace('T', ' ').substring(0, 16),
        supervisorNote: notes || '4-Point standards verified' 
      },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await Log.create({
      id: Date.now(),
      author: `${req.user.name} (${req.user.designation})`,
      time: timeStr,
      category: 'Housekeeping',
      message: `4-Point Inspection Passed for Room ${roomNumber}. Room sanitized & ready for guest arrival. ${notes || ''}`
    });

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
