import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  X, 
  Calendar, 
  Bed, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  LogOut, 
  LogIn, 
  Printer, 
  DollarSign, 
  Sparkles, 
  MapPin, 
  Plus, 
  ShieldCheck,
  Receipt,
  CreditCard,
  Ban,
  AlertTriangle,
  QrCode,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Send,
  Smartphone
} from 'lucide-react';
import { UPIPaymentModal } from './UPIPaymentModal';

export const BookingDetailsModal = () => {
  const { 
    selectedBooking, 
    setSelectedBooking, 
    rooms, 
    bills,
    updateReservationStatus,
    cancelReservation,
    settleAndCheckout,
    openFolioForBooking,
    verifyGuestId,
    setIsNewBookingOpen,
    setPrefilledRoom,
    setPrefilledDate,
    openGuestPass
  } = useHotel();

  const [checkoutWarning, setCheckoutWarning] = useState(false);
  const [cancellingModal, setCancellingModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Guest Travel Schedule Changed');
  const [upiModalBill, setUpiModalBill] = useState(null);
  const [whatsappModal, setWhatsappModal] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!selectedBooking) return null;

  const roomInfo = rooms.find(r => r.number === selectedBooking.room);
  const guestBill = bills.find(b => b.resId === selectedBooking.id || (b.room === selectedBooking.room && b.guest === selectedBooking.guest));

  const handleCheckIn = () => {
    updateReservationStatus(selectedBooking.id, 'checked-in');
    setSelectedBooking({ ...selectedBooking, status: 'checked-in' });
  };

  const handleCheckOutClick = () => {
    if (guestBill && guestBill.status === 'pending') {
      setCheckoutWarning(true);
    } else {
      updateReservationStatus(selectedBooking.id, 'checked-out');
      setSelectedBooking({ ...selectedBooking, status: 'checked-out' });
    }
  };

  const handleConfirmCancel = () => {
    cancelReservation(selectedBooking.id, cancelReason);
    setSelectedBooking(null);
    setCancellingModal(false);
  };

  const getWhatsAppMessage = () => {
    if (!selectedBooking) return '';
    const roomType = roomInfo?.type || 'Royal Chamber';
    const amountStr = guestBill ? `₹${guestBill.total.toLocaleString('en-IN')}` : `₹${(selectedBooking.totalAmount || 0).toLocaleString('en-IN')}`;
    const paymentStatus = guestBill?.status === 'paid' ? 'Paid & Settled' : 'Payable on Arrival / Checkout';

    return `*Namaste ${selectedBooking.guest}!* 🙏\nWarm greetings from *Rajvilas Heritage Palace & Resort, Udaipur*.\n\nYour royal reservation is confirmed:\n🏨 *Booking ID:* #${selectedBooking.id}\n🏰 *Chamber / Suite:* Room #${selectedBooking.room} (${roomType})\n📅 *Check-In:* ${selectedBooking.checkin} (From 2:00 PM IST)\n📅 *Check-Out:* ${selectedBooking.checkout} (Until 11:00 AM IST)\n👥 *Guests:* ${selectedBooking.guestsCount || 2} Adults\n💳 *Folio Tariff:* ${amountStr} [${paymentStatus}]\n\n🦚 *Special Services:* Our Concierge is pleased to assist you with Satvik/Jain dining preferences, Udaipur airport transfers, or Lake Pichola boat excursions.\n\n*Padharo Mhare Desh!* ✨\n_Rajvilas Palace Concierge Desk: +91 294 248 8900_`;
  };

  const handleCopyWhatsApp = () => {
    const text = getWhatsAppMessage();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedMsg(true);
        setTimeout(() => setCopiedMsg(false), 2500);
      }).catch(() => {});
    }
  };

  const handleOpenWhatsAppWeb = () => {
    const text = getWhatsAppMessage();
    const cleanPhone = (selectedBooking.phone || '').replace(/[^0-9]/g, '');
    const phoneParam = cleanPhone ? `phone=${cleanPhone}&` : '';
    const url = `https://api.whatsapp.com/send?${phoneParam}text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'checked-in':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'checked-out':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-600/30">
            <LogOut className="w-3.5 h-3.5" /> Checked Out
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Ban className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedBooking(null)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold">
              RESERVATION #{selectedBooking.id}
            </span>
            {getStatusBadge(selectedBooking.status)}
          </div>
          <h3 className="text-2xl font-bold font-serif text-white mt-1">
            {selectedBooking.guest}
          </h3>
          <p className="text-xs text-slate-400">
            {selectedBooking.guestsCount} {selectedBooking.guestsCount === 1 ? 'Guest' : 'Guests'} • Confirmed Registration
          </p>
        </div>

        {/* Quick Contact & Details */}
        <div className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div>
              <span className="text-slate-500 block mb-0.5">Email</span>
              <span className="text-slate-200 font-medium flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {selectedBooking.email}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Contact</span>
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {selectedBooking.phone}
              </span>
            </div>
          </div>

          {/* Government Identity Verification (Indian Compliance) */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Govt Photo ID (Police Compliance)
              </span>
              <span className="text-slate-200 text-xs font-medium mt-0.5 block">
                {selectedBooking.idType || 'Aadhaar Card'}: <strong className="font-mono text-amber-300">{selectedBooking.idNumber || 'Not Logged'}</strong>
              </span>
            </div>
            {selectedBooking.idVerified ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            ) : (
              <button
                onClick={() => {
                  verifyGuestId(selectedBooking.id, selectedBooking.idType || 'Aadhaar Card', selectedBooking.idNumber || 'Verified at Reception');
                  setSelectedBooking(prev => ({ ...prev, idVerified: true }));
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition shadow cursor-pointer"
              >
                Verify ID Now
              </button>
            )}
          </div>

          {/* Stay & Room Details */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Room Assignment</span>
                <span className="font-bold text-amber-400 text-sm">Room {selectedBooking.room}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Room Type</span>
                <span className="font-semibold text-slate-200">{roomInfo ? roomInfo.type : 'Deluxe'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 block">Check-in</span>
                <span className="font-medium text-slate-300">{selectedBooking.checkin} (from 3:00 PM)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Check-out</span>
                <span className="font-medium text-slate-300">{selectedBooking.checkout} (until 11:00 AM)</span>
              </div>
            </div>
          </div>

          {/* Special VIP Requests */}
          {selectedBooking.notes && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Special Requests & Guest Preferences:</span>
              </div>
              <p className="text-xs text-amber-200/90 italic">
                "{selectedBooking.notes}"
              </p>
            </div>
          )}

          {/* Folio Summary & Direct Billing Bridge */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-amber-400" />
                  Guest Billing Folio & Ledger
                </span>
                <span className="text-lg font-bold font-serif text-white mt-0.5 block">
                  ₹{(guestBill ? guestBill.total : selectedBooking.totalAmount + Math.round(selectedBooking.totalAmount * 0.12)).toLocaleString('en-IN')}
                </span>
              </div>

              {guestBill && (
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    guestBill.status === 'paid' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {guestBill.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {guestBill.status === 'paid' ? 'Fully Settled' : 'Pending Payment'}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Folio #{guestBill.id}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 block">Room Tariff (Net)</span>
                <span className="font-mono text-slate-300">₹{selectedBooking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Dining & Incidentals</span>
                <span className="font-mono text-slate-300">₹{(guestBill ? guestBill.extraCharges : 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Direct Bridge Button to Billing Folio */}
            <button
              onClick={() => openFolioForBooking(selectedBooking.id)}
              className="w-full mt-1 py-1.5 px-3 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Open Folio & Post Charges / Settle Bill →</span>
            </button>
          </div>

          {/* Palace Print Signatures (Shown only on Print) */}
          <div className="hidden print:flex justify-between items-end pt-8 text-xs border-t border-slate-300 mt-4">
            <div>
              <p className="border-b border-black w-48 mb-1"></p>
              <p className="font-semibold text-black">Guest Signature</p>
              <p className="text-[10px] text-gray-600">Certified that provided identity and stay details are accurate.</p>
            </div>
            <div className="text-right">
              <p className="border-b border-black w-48 mb-1 ml-auto"></p>
              <p className="font-semibold text-black">Front Desk Executive</p>
              <p className="text-[10px] text-gray-600">Rajvilas Heritage Palace & Resort • Udaipur</p>
            </div>
          </div>

        </div>

        {/* Operational Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-6 pt-4 border-t border-slate-800">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Registration</span>
            </button>

            {/* Palace WhatsApp Confirmation Trigger */}
            <button
              onClick={() => setWhatsappModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition cursor-pointer"
              title="Send authentic Palace stay pass to guest's WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Palace WhatsApp</span>
            </button>

            {/* Guest Digital Pass Keycard */}
            <button
              onClick={() => openGuestPass(selectedBooking)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
              title="Preview guest's Apple/Google Wallet-style digital room keycard"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Digital Keycard</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct UPI Payment trigger if guest has pending folio */}
            {guestBill && guestBill.status === 'pending' && (
              <button
                onClick={() => setUpiModalBill(guestBill)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                title="Generate dynamic BHIM UPI QR Code for instant settlement"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pay via UPI QR</span>
              </button>
            )}

            {selectedBooking.status !== 'checked-in' && selectedBooking.status !== 'checked-out' && selectedBooking.status !== 'cancelled' && (
              <button
                onClick={handleCheckIn}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Check In Now</span>
              </button>
            )}

            {selectedBooking.status === 'checked-in' && (
              <button
                onClick={handleCheckOutClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Express Check-Out</span>
              </button>
            )}

            {/* Cancel Stay Button */}
            {selectedBooking.status !== 'checked-out' && selectedBooking.status !== 'cancelled' && (
              <button
                onClick={() => setCancellingModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Stay</span>
              </button>
            )}

            {selectedBooking.status === 'checked-out' && (
              <button
                onClick={() => {
                  const roomNum = selectedBooking.room;
                  setSelectedBooking(null);
                  setPrefilledRoom(roomNum);
                  setPrefilledDate('2026-10-24');
                  setIsNewBookingOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Re-Book Room {selectedBooking.room}</span>
              </button>
            )}

            <button
              onClick={() => setSelectedBooking(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>

      {/* Unsettled Bill Alert on Check-Out */}
      {checkoutWarning && guestBill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-amber-500/40 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setCheckoutWarning(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Unsettled Bill on Room #{selectedBooking.room}</span>
            </div>
            
            <p className="text-xs text-slate-300 mb-4">
              Guest <strong>{selectedBooking.guest}</strong> has an open balance of{' '}
              <strong className="text-rose-400 font-mono text-sm">
                ₹{guestBill.total.toLocaleString('en-IN')}
              </strong>{' '}
              (Folio #{guestBill.id}). Settle now with UPI/Card before releasing guest?
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  settleAndCheckout(selectedBooking.id);
                  setSelectedBooking(prev => ({ ...prev, status: 'checked-out' }));
                  setCheckoutWarning(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Settle Folio via UPI/Card & Check-Out</span>
              </button>

              <button
                onClick={() => {
                  updateReservationStatus(selectedBooking.id, 'checked-out');
                  setSelectedBooking(prev => ({ ...prev, status: 'checked-out' }));
                  setCheckoutWarning(false);
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs transition cursor-pointer"
              >
                Proceed with Check-Out (Keep Folio Pending)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Stay Modal */}
      {cancellingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setCancellingModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                <Ban className="w-4 h-4" />
                <span>Cancel Reservation & Release Room</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Booking #{selectedBooking.id} — {selectedBooking.guest}
              </h3>
              <p className="text-xs text-slate-400">
                Room #{selectedBooking.room} • {selectedBooking.checkin} → {selectedBooking.checkout}
              </p>
            </div>

            <div className="space-y-3 mb-5 text-xs">
              <label className="block text-slate-300 font-medium">Select Reason for Cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Guest Travel Schedule Changed">Guest Travel Schedule Changed</option>
                <option value="Flight / Train Delay or Cancellation">Flight / Train Delay or Cancellation</option>
                <option value="Family Emergency">Family Emergency</option>
                <option value="No-Show / Guest Unreachable">No-Show / Guest Unreachable</option>
                <option value="Duplicate Booking">Duplicate Booking</option>
                <option value="Other / Front Office Override">Other / Front Office Override</option>
              </select>

              <p className="text-[11px] text-amber-300/80 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                ★ This will cancel the booking and release Room #{selectedBooking.room} on the timeline and room matrix immediately.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCancellingModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Palace WhatsApp Confirmation Dispatch Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-emerald-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            
            <button
              onClick={() => setWhatsappModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  Official WhatsApp Dispatch
                </span>
                <span className="text-[10px] text-slate-400">
                  To: {selectedBooking.phone || '+91 98201 55667'}
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-white mt-1">
                Royal Stay Confirmation Pass
              </h3>
              <p className="text-xs text-slate-400">
                Dispatch authentic palace welcome and room confirmation directly to the guest's mobile device.
              </p>
            </div>

            {/* WhatsApp Message Preview Box */}
            <div className="bg-[#0b101a] border border-emerald-500/20 rounded-xl p-4 text-xs font-mono text-emerald-200/90 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto select-all shadow-inner">
              {getWhatsAppMessage()}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMsg ? 'Copied to Clipboard!' : 'Copy Message'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWhatsappModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOpenWhatsAppWeb}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Indian UPI QR Modal */}
      <UPIPaymentModal
        isOpen={Boolean(upiModalBill)}
        onClose={() => setUpiModalBill(null)}
        bill={upiModalBill}
      />
    </>
  );
};
