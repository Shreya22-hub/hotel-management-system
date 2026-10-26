import React, { useState, useEffect, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  X, 
  Calendar, 
  Bed, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  Sparkles, 
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Tag,
  Check,
  Crown
} from 'lucide-react';

export const NewBookingModal = () => {
  const { 
    isNewBookingOpen, 
    setIsNewBookingOpen, 
    rooms, 
    reservations,
    addReservation,
    prefilledRoom,
    setPrefilledRoom,
    prefilledDate,
    setPrefilledDate
  } = useHotel();

  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roomId, setRoomId] = useState('');
  const [checkin, setCheckin] = useState('2026-10-24');
  const [checkout, setCheckout] = useState('2026-10-27');
  const [guestsCount, setGuestsCount] = useState(2);
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [idVerified, setIdVerified] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Royal Promo & Coupon State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoFeedback, setPromoFeedback] = useState(null);

  const PROMO_CODES = {
    'ROYAL10': { code: 'ROYAL10', type: 'percent', value: 10, label: '10% Royal Heritage Discount', minSpend: 0 },
    'PALACE2026': { code: 'PALACE2026', type: 'flat', value: 5000, label: '₹5,000 Luxury Welcome Voucher', minSpend: 15000 },
    'WEDDINGVIP': { code: 'WEDDINGVIP', type: 'flat', value: 15000, label: '₹15,000 Grand Imperial Wedding Discount', minSpend: 40000 },
    'MAHARAJA20': { code: 'MAHARAJA20', type: 'percent', value: 20, label: '20% Maharaja Club Elite Privilege', minSpend: 0 }
  };

  // Handle prefilled values when modal opens
  useEffect(() => {
    if (prefilledRoom) {
      const matched = rooms.find(r => r.number === prefilledRoom);
      if (matched) setRoomId(matched.id.toString());
    } else if (rooms.length > 0 && !roomId) {
      setRoomId(rooms[0].id.toString());
    }

    if (prefilledDate) {
      setCheckin(prefilledDate);
      const d = new Date(prefilledDate);
      d.setDate(d.getDate() + 3);
      setCheckout(d.toISOString().split('T')[0]);
    }
  }, [prefilledRoom, prefilledDate, rooms]);

  const selectedRoomObj = rooms.find(r => r.id === parseInt(roomId)) || rooms[0];

  // 1. Validate Date Sequence
  const isDateSequenceInvalid = useMemo(() => {
    return checkout <= checkin;
  }, [checkin, checkout]);

  // 2. Validate Date Conflict with existing confirmed/checked-in bookings for this room
  const conflictingBooking = useMemo(() => {
    if (!selectedRoomObj || isDateSequenceInvalid) return null;
    const roomNum = selectedRoomObj.number;
    
    // Check against active/confirmed bookings on this room
    const activeRoomBookings = reservations.filter(
      r => r.room === roomNum && (r.status === 'checked-in' || r.status === 'confirmed' || r.status === 'pending')
    );

    // Collision formula: checkin < existing.checkout && checkout > existing.checkin
    return activeRoomBookings.find(b => {
      return checkin < b.checkout && checkout > b.checkin;
    }) || null;
  }, [selectedRoomObj, reservations, checkin, checkout, isDateSequenceInvalid]);

  // Calculate nights & pricing
  const dIn = new Date(checkin);
  const dOut = new Date(checkout);
  const diffTime = Math.max(0, dOut - dIn);
  const nights = isDateSequenceInvalid ? 0 : Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const roomPricePerNight = selectedRoomObj ? selectedRoomObj.price : 6500;
  const subtotal = nights * roomPricePerNight;

  // Royal Promo Discount Calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round(subtotal * (appliedPromo.value / 100));
    } else if (appliedPromo.type === 'flat') {
      discountAmount = Math.min(appliedPromo.value, subtotal);
    }
  }
  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const taxes = Math.round(netSubtotal * 0.12);
  const grandTotal = netSubtotal + taxes;

  const handleApplyPromo = (codeParam) => {
    const code = (codeParam || promoInput).trim().toUpperCase();
    if (!code) {
      setPromoFeedback({ type: 'error', message: 'Please enter a valid voucher code.' });
      return;
    }
    const promo = PROMO_CODES[code];
    if (!promo) {
      setPromoFeedback({ type: 'error', message: `Invalid code "${code}". Try ROYAL10 or PALACE2026.` });
      return;
    }
    if (subtotal < promo.minSpend) {
      setPromoFeedback({ 
        type: 'error', 
        message: `${promo.code} requires minimum room booking of ₹${promo.minSpend.toLocaleString('en-IN')}.` 
      });
      return;
    }
    setAppliedPromo(promo);
    setPromoFeedback({ 
      type: 'success', 
      message: `Privilege voucher "${promo.code}" applied! ${promo.label}` 
    });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoFeedback(null);
    setPromoInput('');
  };

  if (!isNewBookingOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Guest full name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Contact email address is required.');
      return;
    }
    if (isDateSequenceInvalid) {
      setError('Check-out date must be strictly after the check-in date.');
      return;
    }
    if (conflictingBooking) {
      setError(`Date Conflict: Room ${selectedRoomObj.number} is already booked for ${conflictingBooking.guest} (${conflictingBooking.checkin} → ${conflictingBooking.checkout}).`);
      return;
    }

    addReservation({
      guest: guestName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98201 55667',
      room: selectedRoomObj.number,
      checkin,
      checkout,
      status: 'confirmed',
      guestsCount: parseInt(guestsCount),
      grossAmount: subtotal,
      discount: discountAmount,
      promoCode: appliedPromo ? appliedPromo.code : null,
      totalAmount: netSubtotal,
      idType,
      idNumber: idNumber.trim() || 'Verified on Arrival',
      idVerified,
      notes: notes.trim()
    });

    // Close & reset
    setPrefilledRoom(null);
    setPrefilledDate(null);
    setIsNewBookingOpen(false);
    setGuestName('');
    setEmail('');
    setPhone('');
    setIdNumber('');
    setNotes('');
    setError('');
    setAppliedPromo(null);
    setPromoFeedback(null);
    setPromoInput('');
  };

  const handleClose = () => {
    setPrefilledRoom(null);
    setPrefilledDate(null);
    setIsNewBookingOpen(false);
    setError('');
    setAppliedPromo(null);
    setPromoFeedback(null);
    setPromoInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20 uppercase tracking-widest">
              Rajvilas Palace Concierge
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-white mt-1">Create Guest Reservation</h3>
          <p className="text-xs text-slate-400">Reserve a heritage room or royal suite with real-time collision detection and GST folio generation.</p>
        </div>

        {/* Validation Errors */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Date Overlap Collision Warning */}
        {conflictingBooking && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Room Scheduling Conflict Detected!</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Room <strong>#{selectedRoomObj.number}</strong> is already booked by <strong>{conflictingBooking.guest}</strong> from <strong>{conflictingBooking.checkin}</strong> to <strong>{conflictingBooking.checkout}</strong>.
            </p>
            <p className="text-amber-400/90 text-[11px] font-medium">
              Please choose different dates, or select another available room from the dropdown below.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Guest Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Guest Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="guest@singhania-group.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Phone & Guests Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Phone (+91)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98201 44556"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Number of Guests
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value={1}>1 Guest (Single Occupancy)</option>
                <option value={2}>2 Guests (Double Occupancy)</option>
                <option value={3}>3 Guests (Family Suite)</option>
                <option value={4}>4 Guests (Maharajah Penthouse)</option>
              </select>
            </div>
          </div>

          {/* Government ID Compliance (Indian Hospitality Standard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Govt Photo ID Type (Compliance)
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ID Number
              </label>
              <input
                type="text"
                placeholder="e.g. 9820 4455 1290 or Z890123"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Select Suite or Heritage Room *
              </label>
              <span className="text-[10px] text-amber-400 font-medium">Multiple stays allowed per room</span>
            </div>
            <div className="relative">
              <Bed className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {rooms.map(room => {
                  const statusNote = room.status === 'cleaning'
                    ? ' • [Checked-Out / Ready for Next Stay]'
                    : room.status === 'occupied'
                    ? ' • [Occupied • Open for Future Dates]'
                    : ' • [Available]';
                  return (
                    <option key={room.id} value={room.id}>
                      Room {room.number} — {room.type} (₹{room.price.toLocaleString('en-IN')}/nt){statusNote}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Existing bookings on this room */}
            {selectedRoomObj && (
              <div className="mt-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
                <span className="font-semibold text-amber-300 shrink-0">Room {selectedRoomObj.number} Schedule:</span>
                <span className="truncate">
                  {reservations.filter(r => r.room === selectedRoomObj.number).length === 0
                    ? 'No conflicting stays. Ready for immediate booking.'
                    : reservations.filter(r => r.room === selectedRoomObj.number).map(b => `${b.guest} (${b.checkin} → ${b.checkout} [${b.status}])`).join(' • ')}
                </span>
              </div>
            )}
          </div>

          {/* Dates: Checkin & Checkout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Check-in Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Check-out Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  className={`w-full bg-slate-900 border rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none ${
                    isDateSequenceInvalid ? 'border-rose-500 text-rose-300' : 'border-slate-700/80 focus:border-amber-500'
                  }`}
                />
              </div>
              {isDateSequenceInvalid && (
                <span className="text-[10px] text-rose-400 mt-0.5 block">
                  Check-out must be after check-in.
                </span>
              )}
            </div>
          </div>

          {/* Special VIP Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              VIP Requests & Cultural Preferences
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Pure Jain / Gujarati vegetarian food, airport chauffeur pickup, early check-in for wedding mahurat..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Royal Promo Code & Season Discount Engine */}
          <div className="p-3 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/20 border border-amber-500/25 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Palace Privilege Voucher & Promo Code</span>
              </label>
              {appliedPromo && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> {appliedPromo.code} Active
                </span>
              )}
            </div>

            {/* Quick Promo Pills */}
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {Object.values(PROMO_CODES).map(p => (
                <button
                  type="button"
                  key={p.code}
                  onClick={() => handleApplyPromo(p.code)}
                  className={`px-2 py-0.5 rounded-md border transition cursor-pointer ${
                    appliedPromo?.code === p.code
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-amber-300'
                  }`}
                >
                  {p.code} ({p.type === 'percent' ? `${p.value}%` : `₹${p.value / 1000}k`})
                </button>
              ))}
            </div>

            {/* Input & Apply Button */}
            {!appliedPromo ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. ROYAL10, PALACE2026)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleApplyPromo()}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold">{appliedPromo.code}</span> — {appliedPromo.label}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-[11px] text-slate-400 hover:text-rose-400 ml-2 font-semibold cursor-pointer underline"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Promo Feedback */}
            {promoFeedback && !appliedPromo && (
              <p className={`text-[11px] ${promoFeedback.type === 'error' ? 'text-rose-400' : 'text-emerald-300'}`}>
                {promoFeedback.message}
              </p>
            )}
          </div>

          {/* Real-time Pricing Summary */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Tariff ({nights} nt @ ₹{roomPricePerNight.toLocaleString('en-IN')}):</span>
              <span className="font-mono text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Royal Privilege Discount ({appliedPromo?.code}):
                </span>
                <span className="font-mono font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Net Taxable Tariff:</span>
                <span className="font-mono text-slate-200">₹{netSubtotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>GST (12% Central + State):</span>
              <span className="font-mono text-slate-200">₹{taxes.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span>Estimated Folio Total:</span>
                {discountAmount > 0 && (
                  <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Saved ₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                )}
              </span>
              <span className="font-mono text-amber-400 text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Boolean(conflictingBooking) || isDateSequenceInvalid}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {conflictingBooking ? 'Resolve Date Conflict' : 'Confirm Reservation'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
