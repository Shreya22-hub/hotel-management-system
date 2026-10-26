import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Sparkles, 
  Compass, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  X, 
  Tag, 
  HeartHandshake, 
  Waves, 
  UtensilsCrossed, 
  Flower2, 
  Car, 
  Landmark, 
  Stars, 
  Receipt,
  FileCheck
} from 'lucide-react';
import { formatINR } from '../data/mockData';

export const RoyalExperiences = () => {
  const { 
    experiences, 
    experienceBookings, 
    bookExperience, 
    reservations, 
    rooms, 
    searchQuery 
  } = useHotel();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedExpForBooking, setSelectedExpForBooking] = useState(experiences[0]);

  // Form state
  const [selectedResId, setSelectedResId] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-10-24');
  const [timeSlot, setTimeSlot] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [conciergeNotes, setConciergeNotes] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(null);

  // Active in-house or confirmed reservations eligible for concierge booking
  const eligibleReservations = reservations.filter(
    r => r.status === 'checked-in' || r.status === 'confirmed'
  );

  const categories = [
    { id: 'all', label: 'All Royal Experiences' },
    { id: 'Water Excursion', label: 'Lakes & Waterways' },
    { id: 'Fine Dining', label: 'Royal Culinary' },
    { id: 'Wellness & Spa', label: 'Ayurvedic Wellness' },
    { id: 'Heritage Transport', label: 'Vintage Chauffeur' },
    { id: 'Cultural Walk', label: 'Heritage Walks' },
    { id: 'Palace Tradition', label: 'Vedic Traditions' }
  ];

  const filteredExperiences = experiences.filter(exp => {
    if (selectedCategory !== 'all' && exp.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return exp.title.toLowerCase().includes(q) || exp.description.toLowerCase().includes(q);
    }
    return true;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Water Excursion': return <Waves className="w-4 h-4 text-sky-400" />;
      case 'Fine Dining': return <UtensilsCrossed className="w-4 h-4 text-amber-400" />;
      case 'Wellness & Spa': return <Flower2 className="w-4 h-4 text-rose-400" />;
      case 'Heritage Transport': return <Car className="w-4 h-4 text-amber-300" />;
      case 'Cultural Walk': return <Landmark className="w-4 h-4 text-indigo-400" />;
      case 'Palace Tradition': return <Stars className="w-4 h-4 text-yellow-300" />;
      default: return <Compass className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleOpenBookingModal = (exp) => {
    setSelectedExpForBooking(exp);
    setTimeSlot(exp.timing);
    if (eligibleReservations.length > 0 && !selectedResId) {
      setSelectedResId(eligibleReservations[0].id.toString());
    }
    setIsBookingModalOpen(true);
    setBookingSuccessMsg(null);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!selectedResId || !selectedExpForBooking) return;

    const res = bookExperience(
      selectedResId,
      selectedExpForBooking.id,
      bookingDate,
      timeSlot || selectedExpForBooking.timing,
      guestCount,
      conciergeNotes
    );

    if (res.success) {
      setBookingSuccessMsg(`Experience confirmed for Room ${res.booking.room}! Added ${formatINR(res.booking.amount)} to guest folio.`);
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingSuccessMsg(null);
        setConciergeNotes('');
      }, 1500);
    }
  };

  const totalExperienceRevenue = experienceBookings.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#141b2d] via-[#101626] to-[#0c101d] border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 blur-[80px] pointer-events-none rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Royal Concierge Desk
              </span>
              <span className="text-xs text-slate-400">Lake Pichola & Mewar Heritage Activities</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-wide">
              Curated Palace Experiences
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Reserve signature Mewar boat cruises, royal thali sitar banquets, Jiva Ayurvedic spa therapy, and vintage 1948 Rolls-Royce airport transfers. Charges post directly to the in-house guest’s GST room folio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenBookingModal(experiences[0])}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Experience for Guest</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Curated Activities</span>
            <span className="text-lg font-bold font-serif text-white">{experiences.length} Signature Offerings</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Active Bookings</span>
            <span className="text-lg font-bold font-serif text-amber-300">{experienceBookings.length} Guests Scheduled</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Gross Concierge Revenue</span>
            <span className="text-lg font-bold font-serif text-emerald-400">{formatINR(totalExperienceRevenue)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Billing Automation</span>
            <span className="text-lg font-bold font-serif text-indigo-300">Auto-GST Folio Sync</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Experience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExperiences.map(exp => (
          <div 
            key={exp.id}
            className="bg-[#0f1422] border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group hover:shadow-2xl hover:shadow-amber-500/5"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300">
                  {getCategoryIcon(exp.category)}
                  <span>{exp.category}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                  {exp.badge}
                </span>
              </div>

              {/* Title & Pricing */}
              <h3 className="text-base font-bold font-serif text-white group-hover:text-amber-200 transition">
                {exp.title}
              </h3>
              
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-amber-400">
                  {formatINR(exp.price)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {exp.priceUnit}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 pb-3 border-b border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {exp.duration}
                </span>
                <span>•</span>
                <span>{exp.timing}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300/90 leading-relaxed mt-3">
                {exp.description}
              </p>

              {/* Inclusions */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase block">
                  Royal Inclusions:
                </span>
                {exp.included.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => handleOpenBookingModal(exp)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-slate-700 hover:border-amber-400 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book for In-House Guest</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Active Guest Experience Bookings Ledger */}
      <div className="bg-[#0f1422] border border-slate-800 rounded-2xl shadow-xl overflow-hidden mt-8">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              Active Guest Excursion & Activity Schedule
            </h3>
            <p className="text-xs text-slate-400">
              Live schedule of all concierge bookings synchronized with front desk room folios
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            {experienceBookings.length} Active Bookings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Date & Timing</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Tariff</th>
                <th className="py-3 px-4">Folio Status</th>
                <th className="py-3 px-4">Special Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {experienceBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-500">
                    No royal experiences booked yet.
                  </td>
                </tr>
              ) : (
                experienceBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {b.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {b.guest}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                        Room {b.room}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {b.title}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {b.date} • {b.timeSlot}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {b.guestsCount}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {formatINR(b.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Folio Posted
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400 max-w-xs truncate">
                      {b.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Experience Modal */}
      {isBookingModalOpen && selectedExpForBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
            
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest flex items-center gap-1">
                  <Compass className="w-3 h-3 text-amber-400" />
                  Concierge Excursion Dispatch
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-white mt-1">
                {selectedExpForBooking.title}
              </h3>
              <p className="text-xs text-slate-400">
                Post {formatINR(selectedExpForBooking.price)} ({selectedExpForBooking.priceUnit}) directly to guest room folio.
              </p>
            </div>

            {bookingSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{bookingSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
                
                {/* Select In-House Guest / Room */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Select In-House Guest & Room *
                  </label>
                  <select
                    value={selectedResId}
                    onChange={(e) => setSelectedResId(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {eligibleReservations.map(r => (
                      <option key={r.id} value={r.id}>
                        Room {r.room} — {r.guest} ({r.checkin} → {r.checkout} [{r.status}])
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Experience Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      placeholder={selectedExpForBooking.timing}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Number of Participating Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Rate is {selectedExpForBooking.priceUnit}. Total will adjust accordingly.
                  </p>
                </div>

                {/* Special Concierge Instructions */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Special Concierge Requests / Dietary Notes
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Anniversary cake onboard boat, pure Satvik food, airport flight UK-842 arrival..."
                    value={conciergeNotes}
                    onChange={(e) => setConciergeNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Folio Posting Summary Box */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Activity Charge:</span>
                    <span className="font-mono text-white">
                      {formatINR(selectedExpForBooking.price * (selectedExpForBooking.priceUnit.includes('per guest') ? parseInt(guestCount || 1) : 1))}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>GST (12% Central + State):</span>
                    <span className="font-mono">Included in Folio Settlement</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-300 pt-1 border-t border-slate-800">
                    <span>Total Posted to Room Folio:</span>
                    <span className="font-mono text-sm">
                      {formatINR(selectedExpForBooking.price * (selectedExpForBooking.priceUnit.includes('per guest') ? parseInt(guestCount || 1) : 1))}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Confirm & Post to Folio
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
