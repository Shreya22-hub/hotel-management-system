import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Filter, 
  Plus, 
  Bed, 
  User, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';

export const TimelineCalendar = () => {
  const { 
    rooms, 
    reservations, 
    setSelectedBooking, 
    setIsNewBookingOpen, 
    setPrefilledRoom, 
    setPrefilledDate,
    searchQuery 
  } = useHotel();

  // Selected base anchor date (defaults to 2026-10-22)
  const [baseDate, setBaseDate] = useState(new Date('2026-10-22'));
  const [floorFilter, setFloorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [daysCount, setDaysCount] = useState(14); // 14-day timeline

  // Generate date array for columns
  const timelineDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [baseDate, daysCount]);

  const formatDateKey = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  };

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      if (floorFilter !== 'all' && r.floor !== parseInt(floorFilter)) return false;
      if (typeFilter !== 'all' && r.category !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchRoom = r.number.toString().includes(q) || r.type.toLowerCase().includes(q);
        const matchGuest = reservations.some(res => res.room === r.number && res.guest.toLowerCase().includes(q));
        if (!matchRoom && !matchGuest) return false;
      }
      return true;
    });
  }, [rooms, floorFilter, typeFilter, searchQuery, reservations]);

  // Navigate dates
  const handlePrev = () => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - 7);
    setBaseDate(d);
  };

  const handleNext = () => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + 7);
    setBaseDate(d);
  };

  const handleToday = () => {
    setBaseDate(new Date('2026-10-22'));
  };

  const handleCellClick = (room, dateStr) => {
    setPrefilledRoom(room.number);
    setPrefilledDate(dateStr);
    setIsNewBookingOpen(true);
  };

  return (
    <div className="space-y-4">
      
      {/* Controls & Date Header */}
      <div className="bg-[#111726] border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Title & Date Range */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-400" />
              Reservation Gantt & Timeline
            </h2>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Interactive Matrix
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Viewing {timelineDates[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {timelineDates[timelineDates.length - 1]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Filters & Navigation */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          
          {/* Floor filter */}
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/60"
          >
            <option value="all">All Floors (1–3)</option>
            <option value="1">Floor 1 (Garden/Lobby)</option>
            <option value="2">Floor 2 (Executive)</option>
            <option value="3">Floor 3 (Penthouse Level)</option>
          </select>

          {/* Category filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/60"
          >
            <option value="all">All Room Types</option>
            <option value="Single">Single Rooms</option>
            <option value="Double">Double Rooms</option>
            <option value="Suite">Suites & Penthouse</option>
          </select>

          {/* Date Navigation Buttons */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/70 shadow-inner">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
              title="Previous 7 Days"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold text-amber-300 hover:text-amber-200 transition"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
              title="Next 7 Days"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Gantt Timeline Table Container */}
      <div className="bg-[#111726] border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Scrollable Timeline Grid */}
        <div className="overflow-x-auto relative">
          <table className="w-full border-collapse text-left min-w-[1100px]">
            
            {/* Table Header: Dates */}
            <thead>
              <tr className="bg-[#0b0f17] border-b border-slate-800 text-slate-400 text-xs">
                {/* Fixed Room info header */}
                <th className="sticky left-0 z-30 bg-[#0b0f17] p-3.5 w-60 border-r border-slate-800 shadow-md">
                  <span className="font-semibold text-slate-300 text-xs uppercase tracking-wider">
                    Room & Details ({filteredRooms.length})
                  </span>
                </th>

                {/* Day columns */}
                {timelineDates.map((date, idx) => {
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = date.getDate();
                  const isToday = formatDateKey(date) === '2026-10-22';

                  return (
                    <th 
                      key={idx}
                      className={`p-2.5 text-center border-r border-slate-800/60 min-w-[70px] ${
                        isToday ? 'bg-amber-500/10 border-amber-500/30' : ''
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold text-slate-500">{dayName}</div>
                      <div className={`text-sm font-bold mt-0.5 ${isToday ? 'text-amber-400 font-extrabold' : 'text-slate-200'}`}>
                        {dayNum}
                      </div>
                      {isToday && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5"></span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body: Rooms & Booking Blocks */}
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredRooms.map((room) => {
                // Find all reservations belonging to this room that intersect with the timeline
                const roomResList = reservations.filter(r => r.room === room.number);

                return (
                  <tr key={room.id} className="hover:bg-slate-900/40 transition group">
                    
                    {/* Sticky Room Identification Column */}
                    <td className="sticky left-0 z-20 bg-[#111726] group-hover:bg-[#151c2e] p-3 border-r border-slate-800 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-white tracking-tight">
                            #{room.number}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            room.status === 'occupied' 
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : room.status === 'cleaning'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : room.status === 'maintenance'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {room.status}
                          </span>
                        </div>
                        <span className="text-amber-400/90 font-semibold text-xs font-mono">
                          ₹{room.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                        <span className="truncate max-w-[120px]">{room.type}</span>
                        <span className="text-[10px] text-slate-500">Floor {room.floor}</span>
                      </div>
                    </td>

                    {/* Timeline Day Cells */}
                    {timelineDates.map((date, dayIdx) => {
                      const dateStr = formatDateKey(date);

                      // Check if there is an active reservation on this date (ignoring cancelled bookings)
                      const booking = roomResList.find(res => {
                        return res.status !== 'cancelled' && dateStr >= res.checkin && dateStr < res.checkout;
                      });

                      const isStart = booking && booking.checkin === dateStr;
                      const isToday = dateStr === '2026-10-22';
                      const isSearchMatch = Boolean(
                        searchQuery && 
                        booking && 
                        (booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         booking.id.toString().includes(searchQuery))
                      );

                      if (booking) {
                        // Check booking status for custom color accents
                        const isCheckedIn = booking.status === 'checked-in';
                        const isConfirmed = booking.status === 'confirmed';

                        return (
                          <td 
                            key={dayIdx} 
                            className={`p-1 border-r border-slate-800/60 relative ${isToday ? 'bg-amber-500/5' : ''}`}
                          >
                            <div
                              onClick={() => setSelectedBooking(booking)}
                              className={`h-9 rounded-lg px-2 flex items-center cursor-pointer transition-all transform hover:scale-[1.02] shadow-md ${
                                isSearchMatch ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 shadow-amber-500/30' : ''
                              } ${
                                isCheckedIn
                                  ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white border border-indigo-400/40'
                                  : isConfirmed
                                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 font-bold border border-amber-300/50'
                                  : 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border border-sky-400/40'
                              } ${!isStart ? 'opacity-95' : ''}`}
                              title={`${booking.guest} • ${booking.status.toUpperCase()} (${booking.checkin} → ${booking.checkout}) • Click to open details`}
                            >
                              {isStart ? (
                                <div className="truncate flex items-center gap-1.5 w-full">
                                  <User className="w-3 h-3 shrink-0" />
                                  <span className="font-semibold text-xs truncate">{booking.guest}</span>
                                </div>
                              ) : (
                                <span className="text-[10px] opacity-75 font-mono truncate">
                                  #{booking.id}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // Empty Slot: Clickable to add booking
                      return (
                        <td 
                          key={dayIdx} 
                          onClick={() => handleCellClick(room, dateStr)}
                          className={`p-1 border-r border-slate-800/60 hover:bg-slate-800/40 cursor-pointer transition relative group/cell ${
                            isToday ? 'bg-amber-500/5' : ''
                          }`}
                          title={`Click to book Room ${room.number} on ${dateStr}`}
                        >
                          <div className="h-9 w-full rounded-lg flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition text-slate-500 hover:text-amber-400">
                            <Plus className="w-3.5 h-3.5" />
                          </div>
                        </td>
                      );
                    })}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend & Instructions Footer */}
        <div className="p-3.5 bg-[#0b0f17] border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Legend:</span>
            
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-indigo-700 to-purple-700 border border-indigo-400/40"></span>
              <span className="text-slate-300 text-[11px]">Checked In</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-amber-600 to-amber-700 border border-amber-300/50"></span>
              <span className="text-slate-300 text-[11px]">Confirmed</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-sky-600 to-blue-700 border border-sky-400/40"></span>
              <span className="text-slate-300 text-[11px]">Pending Approval</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 text-[11px]">Vacant Slot (Click + to reserve)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            Click any active booking bar to view Folio or Check-Out.
          </div>
        </div>

      </div>

    </div>
  );
};
