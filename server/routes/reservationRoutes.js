import express from 'express';
import { Reservation } from '../models/Reservation.js';
import { Room } from '../models/Room.js';
import { Bill } from '../models/Bill.js';
import { Log } from '../models/Log.js';
import { authGuard, roleGuard } from '../middleware/securityMiddleware.js';
import { maskGovtId } from '../utils/cryptoSecurity.js';

const router = express.Router();

// Get all reservations (Admin and Reception only - Housekeeping blocked)
router.get('/', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ id: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new reservation with collision validation
router.post('/', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const { 
      guest, 
      email, 
      phone, 
      room, 
      checkin, 
      checkout, 
      guestsCount, 
      totalAmount, 
      idType, 
      idNumber, 
      idVerified, 
      notes 
    } = req.body;

    if (!guest || !email || !room || !checkin || !checkout) {
      return res.status(400).json({ message: 'Guest name, email, room, check-in, and check-out dates are required.' });
    }

    if (checkout <= checkin) {
      return res.status(400).json({ message: 'Check-out date must be strictly after check-in date.' });
    }

    const roomNum = parseInt(room);

    // Collision formula: checkin < existing.checkout && checkout > existing.checkin
    const conflict = await Reservation.findOne({
      room: roomNum,
      status: { $in: ['confirmed', 'checked-in', 'pending'] },
      checkin: { $lt: checkout },
      checkout: { $gt: checkin }
    });

    if (conflict) {
      return res.status(409).json({
        message: `Date Conflict: Room ${roomNum} is already booked by ${conflict.guest} (${conflict.checkin} → ${conflict.checkout}).`,
        conflictingBooking: conflict
      });
    }

    // Generate new sequential ID
    const lastRes = await Reservation.findOne().sort({ id: -1 });
    const newId = lastRes ? lastRes.id + 1 : 1;

    // Apply Indian privacy masking on ID
    const maskedNumber = maskGovtId(idType || 'Aadhaar Card', idNumber);

    const newRes = await Reservation.create({
      id: newId,
      guest: guest.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '+91 98201 55667',
      room: roomNum,
      checkin,
      checkout,
      status: 'confirmed',
      guestsCount: parseInt(guestsCount) || 2,
      totalAmount: parseFloat(totalAmount) || 6500,
      idType: idType || 'Aadhaar Card',
      idNumber: maskedNumber,
      idVerified: Boolean(idVerified),
      notes: notes || ''
    });

    // Auto-create itemized folio in MongoDB with 12% GST
    const billId = 1000 + newId;
    const taxes = Math.round(newRes.totalAmount * 0.12);
    await Bill.create({
      id: billId,
      resId: newId,
      guest: newRes.guest,
      room: newRes.room,
      roomCharges: newRes.totalAmount,
      extraCharges: 0,
      taxes: taxes,
      total: newRes.totalAmount + taxes,
      status: 'pending',
      paymentMethod: 'UPI / Credit Card Pre-auth',
      date: newRes.checkin,
      items: [
        {
          id: 1,
          description: `Room Tariff (${newRes.checkin} → ${newRes.checkout})`,
          amount: newRes.totalAmount,
          date: newRes.checkin
        }
      ]
    });

    // If checkin is active today, update room status
    const todayStr = '2026-10-24';
    if (checkin <= todayStr && checkout > todayStr) {
      await Room.findOneAndUpdate({ number: roomNum }, { status: 'occupied' });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await Log.create({
      id: Date.now(),
      author: `${req.user.name} (${req.user.designation})`,
      time: timeStr,
      category: 'Front Desk',
      message: `New booking #${newId} confirmed for ${newRes.guest} in Room ${newRes.room}`
    });

    res.status(201).json(newRes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update status (e.g. check-in, check-out)
router.patch('/:id/status', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const { status } = req.body;
    const resId = parseInt(req.params.id);

    const reservation = await Reservation.findOneAndUpdate(
      { id: resId },
      { status },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (status === 'checked-out') {
      await Room.findOneAndUpdate({ number: reservation.room }, { status: 'cleaning' });
      await Log.create({
        id: Date.now(),
        author: `${req.user.name} (${req.user.designation})`,
        time: timeStr,
        category: 'Front Desk',
        message: `Guest ${reservation.guest} checked out of Room ${reservation.room}. Room flagged for turnover.`
      });
    } else if (status === 'checked-in') {
      await Room.findOneAndUpdate({ number: reservation.room }, { status: 'occupied' });
      await Log.create({
        id: Date.now(),
        author: `${req.user.name} (${req.user.designation})`,
        time: timeStr,
        category: 'Front Desk',
        message: `Guest ${reservation.guest} checked in to Room ${reservation.room}.`
      });
    }

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel Reservation & Release Room
router.post('/:id/cancel', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const resId = parseInt(req.params.id);
    const { reason } = req.body;

    const reservation = await Reservation.findOne({ id: resId });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    reservation.status = 'cancelled';
    reservation.cancellationReason = reason || 'Guest Request';
    reservation.cancelledAt = new Date().toISOString();
    await reservation.save();

    // If was checked-in or current occupant, release room
    if (reservation.status === 'checked-in') {
      await Room.findOneAndUpdate({ number: reservation.room }, { status: 'cleaning' });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await Log.create({
      id: Date.now(),
      author: `${req.user.name} (${req.user.designation})`,
      time: timeStr,
      category: 'Front Desk',
      message: `Reservation #${resId} for ${reservation.guest} (Room ${reservation.room}) CANCELLED. Reason: ${reason || 'Guest Request'}. Room released.`
    });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Settle Folio & Express Check-Out in 1 action
router.post('/:id/settle-checkout', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const resId = parseInt(req.params.id);
    const { paymentMethod } = req.body;

    const reservation = await Reservation.findOneAndUpdate(
      { id: resId },
      { status: 'checked-out' },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    // Settle folio
    const bill = await Bill.findOneAndUpdate(
      { $or: [{ resId: resId }, { room: reservation.room, guest: reservation.guest }] },
      { status: 'paid', paymentMethod: paymentMethod || 'UPI / Card at Express Checkout' },
      { new: true }
    );

    // Flag room for turnover
    await Room.findOneAndUpdate({ number: reservation.room }, { status: 'cleaning' });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await Log.create({
      id: Date.now(),
      author: `${req.user.name} (${req.user.designation})`,
      time: timeStr,
      category: 'Front Desk',
      message: `Folio #${bill ? bill.id : ''} settled in full & Express Check-Out completed for ${reservation.guest} (Room ${reservation.room})`
    });

    res.json({ reservation, bill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify Govt ID
router.patch('/:id/verify-id', authGuard, roleGuard('admin', 'reception'), async (req, res) => {
  try {
    const resId = parseInt(req.params.id);
    const { idType, idNumber } = req.body;

    const maskedNumber = idNumber ? maskGovtId(idType, idNumber) : undefined;

    const reservation = await Reservation.findOneAndUpdate(
      { id: resId },
      { 
        idVerified: true,
        ...(idType && { idType }),
        ...(maskedNumber && { idNumber: maskedNumber })
      },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
