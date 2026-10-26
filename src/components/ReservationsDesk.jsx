import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  LogIn, 
  LogOut, 
  Eye, 
  Plus, 
  Bed, 
  Phone, 
  Mail,
  Sparkles,
  Ban,
  AlertTriangle,
  CreditCard,
  X
} from 'lucide-react';

export const ReservationsDesk = () => {
  const { 
    reservations, 
    updateReservationStatus, 
    cancelReservation,
    settleAndCheckout,
    bills,
    setSelectedBooking, 
    setIsNewBookingOpen,
    setPrefilledRoom,
    setPrefilledDate,
    searchQuery 
  } = useHotel();

  const [statusFilter, setStatusFilter] = useState('all');
  const [localSearch, setLocalSearch] = useState('');
  const [cancellingRes, setCancellingRes] = useState(null);
  const [cancelReason, setCancelReason] = useState('Guest Travel Schedule Changed');
  const [checkoutPrompt, setCheckoutPrompt] = useState(null); // { res, bill }

  const activeSearch = localSearch || searchQuery;

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      if (statusFilter !== 'all' && res.status !== statusFilter) return false;
      if (activeSearch) {
        const query = activeSearch.toLowerCase();
        const matchGuest = res.guest.toLowerCase().includes(query);
        const matchRoom = res.room.toString().includes(query);
        const matchEmail = res.email.toLowerCase().includes(query);
        if (!matchGuest && !matchRoom && !matchEmail) return false;
      }
      return true;
    });
  }, [reservations, statusFilter, activeSearch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'checked-in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <CheckCircle2 className="w-3 h-3" /> Checked In
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'checked-out':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-600/30">
            <LogOut className="w-3 h-3" /> Checked Out
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <Ban className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handleCheckoutClick = (res) => {
    const bill = bills.find(b => b.resId === res.id || (b.room === res.room && b.guest === res.guest));
    if (bill && bill.status === 'pending') {
      setCheckoutPrompt({ res, bill });
    } else {
      updateReservationStatus(res.id, 'checked-out');
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingRes) return;
    cancelReservation(cancellingRes.id, cancelReason);
    setCancellingRes(null);
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Guest Reservations & Reception Desk
          </h2>
          <p className="text-xs text-slate-400">
            Manage live guest arrivals, fast check-in/out, folios, and VIP requests
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search guest or room..."
              className="bg-slate-900 border border-slate-700/70 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 w-full md:w-48 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/60"
          >
            <option value="all">All Statuses ({reservations.length})</option>
            <option value="checked-in">Checked In</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="checked-out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Add Booking Button */}
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Bookings Table Card */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Res ID & Guest</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Dates & Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Special Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No reservations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  return (
                    <tr 
                      key={res.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* Guest details */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          <span className="font-mono text-xs text-amber-400/80">#{res.id}</span>
                          <span>{res.guest}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {res.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {res.phone}
                          </span>
                        </div>
                      </td>

                      {/* Room */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold text-xs">
                            Room {res.room}
                          </span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{res.checkin}</span>
                          <span className="text-slate-600">→</span>
                          <span>{res.checkout}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {res.guestsCount} {res.guestsCount === 1 ? 'Guest' : 'Guests'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(res.status)}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white font-mono">
                          ₹{res.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Special Notes */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {res.notes ? (
                          <div className="text-slate-300 text-[11px] truncate flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{res.notes}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Check-in */}
                          {res.status !== 'checked-in' && res.status !== 'checked-out' && res.status !== 'cancelled' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'checked-in')}
                              title="Express Check In"
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <LogIn className="w-3 h-3" />
                              <span>Check In</span>
                            </button>
                          )}

                          {/* Quick Check-out with Unsettled Bill Guard */}
                          {res.status === 'checked-in' && (
                            <button
                              onClick={() => handleCheckoutClick(res)}
                              title="Express Check Out & Dispatch Housekeeping"
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <LogOut className="w-3 h-3" />
                              <span>Check Out</span>
                            </button>
                          )}

                          {/* Quick Cancel Stay */}
                          {res.status !== 'checked-out' && res.status !== 'cancelled' && (
                            <button
                              onClick={() => setCancellingRes(res)}
                              title="Cancel Reservation & Release Room"
                              className="px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Ban className="w-3 h-3" />
                              <span className="hidden xl:inline">Cancel</span>
                            </button>
                          )}

                          {/* Quick Re-Book for Checked-Out Room */}
                          {res.status === 'checked-out' && (
                            <button
                              onClick={() => {
                                setPrefilledRoom(res.room);
                                setPrefilledDate('2026-10-24');
                                setIsNewBookingOpen(true);
                              }}
                              title={`Create a new booking for Room ${res.room} following checkout`}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Re-Book Room</span>
                            </button>
                          )}

                          {/* View details */}
                          <button
                            onClick={() => setSelectedBooking(res)}
                            title="View Full Booking Details"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unsettled Bill Alert on Check-Out Modal */}
      {checkoutPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-amber-500/40 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setCheckoutPrompt(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Pending Balance on Room #{checkoutPrompt.res.room}</span>
            </div>
            
            <p className="text-xs text-slate-300 mb-3">
              Guest <strong>{checkoutPrompt.res.guest}</strong> has an unsettled folio balance of{' '}
              <strong className="text-rose-400 font-mono text-sm">
                ₹{checkoutPrompt.bill.total.toLocaleString('en-IN')}
              </strong>{' '}
              (Folio #{checkoutPrompt.bill.id}).
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] space-y-1 mb-5">
              <div className="flex justify-between text-slate-400">
                <span>Room Charges:</span>
                <span className="font-mono text-white">₹{checkoutPrompt.bill.roomCharges.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Incidentals & Dining:</span>
                <span className="font-mono text-white">₹{checkoutPrompt.bill.extraCharges.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (12%):</span>
                <span className="font-mono text-white">₹{checkoutPrompt.bill.taxes.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-amber-300">
                <span>Total Due:</span>
                <span className="font-mono">₹{checkoutPrompt.bill.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  settleAndCheckout(checkoutPrompt.res.id);
                  setCheckoutPrompt(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Settle Folio via UPI/Card & Complete Check-Out</span>
              </button>

              <button
                onClick={() => {
                  updateReservationStatus(checkoutPrompt.res.id, 'checked-out');
                  setCheckoutPrompt(null);
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs transition cursor-pointer"
              >
                Proceed with Check-Out (Keep Folio Pending)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reservation Modal */}
      {cancellingRes && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setCancellingRes(null)}
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
                Booking #{cancellingRes.id} — {cancellingRes.guest}
              </h3>
              <p className="text-xs text-slate-400">
                Room #{cancellingRes.room} • {cancellingRes.checkin} → {cancellingRes.checkout}
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
                ★ Cancelling will immediately release Room #{cancellingRes.room} on the timeline and room matrix, allowing other guests to book those dates.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCancellingRes(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Keep Booking Active
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
    </div>
  );
};
