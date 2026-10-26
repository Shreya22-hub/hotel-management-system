import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  BedDouble, 
  Sparkles, 
  CheckCircle2, 
  Wrench, 
  Users, 
  DollarSign, 
  Filter, 
  Search, 
  Plus,
  CalendarDays,
  Clock,
  History,
  ClipboardCheck,
  X
} from 'lucide-react';

export const RoomMatrix = () => {
  const { 
    rooms, 
    updateRoomStatus, 
    completeInspectionAndClean, 
    reservations, 
    setIsNewBookingOpen, 
    setPrefilledRoom,
    searchQuery 
  } = useHotel();

  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [inspectingRoom, setInspectingRoom] = useState(null);

  // 4-Point Inspection Checklist items
  const [checklist, setChecklist] = useState({
    linens: true,
    toiletries: true,
    teaCopper: true,
    acScent: true
  });
  const [inspectionNote, setInspectionNote] = useState('');

  const activeSearch = search || searchQuery;

  const filtered = useMemo(() => {
    return rooms.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (activeSearch) {
        const q = activeSearch.toLowerCase();
        const matchNumber = r.number.toString().includes(q);
        const matchType = r.type.toLowerCase().includes(q);
        const matchGuest = reservations.some(res => res.room === r.number && res.guest.toLowerCase().includes(q));
        if (!matchNumber && !matchType && !matchGuest) return false;
      }
      return true;
    });
  }, [rooms, statusFilter, categoryFilter, activeSearch, reservations]);

  const handleBookRoom = (roomNum) => {
    setPrefilledRoom(roomNum);
    setIsNewBookingOpen(true);
  };

  const handleOpenInspection = (room) => {
    setInspectingRoom(room);
    setChecklist({
      linens: true,
      toiletries: true,
      teaCopper: true,
      acScent: true
    });
    setInspectionNote('');
  };

  const handleConfirmInspection = () => {
    if (!inspectingRoom) return;
    completeInspectionAndClean(inspectingRoom.number, inspectionNote);
    setInspectingRoom(null);
  };

  return (
    <div className="space-y-5">
      
      {/* Header & Filter Controls */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-amber-400" />
            Heritage Room Inventory & Status Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Live 30-room matrix • 4-Point supervisor turnover inspection & multiple reservation scheduling supported
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room # or suite..."
              className="bg-slate-900 border border-slate-700/70 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Status buttons */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700/70 text-xs">
            {['all', 'available', 'occupied', 'cleaning', 'maintenance'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition cursor-pointer ${
                  statusFilter === status
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(room => {
          // Find all bookings logged for this room
          const roomBookings = reservations.filter(r => r.room === room.number);
          const checkedOutBookings = roomBookings.filter(r => r.status === 'checked-out');
          const currentOccupant = roomBookings.find(r => r.status === 'checked-in');
          const upcomingBookings = roomBookings.filter(r => r.status === 'confirmed' || r.status === 'pending');

          return (
            <div
              key={room.id}
              className={`bg-[#111726] border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition group hover:shadow-2xl ${
                room.status === 'occupied'
                  ? 'border-indigo-500/30 hover:border-indigo-500/60'
                  : room.status === 'cleaning'
                  ? 'border-amber-500/40 hover:border-amber-500/70 bg-gradient-to-b from-[#18131d] to-[#111726]'
                  : room.status === 'maintenance'
                  ? 'border-rose-500/30 hover:border-rose-500/60'
                  : 'border-emerald-500/30 hover:border-emerald-500/60'
              }`}
            >
              <div>
                {/* Room Top Bar */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Floor {room.floor}</span>
                    <div className="text-xl font-bold font-serif text-white flex items-center gap-2">
                      #{room.number}
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    room.status === 'occupied'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : room.status === 'cleaning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : room.status === 'maintenance'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {room.status === 'cleaning' ? 'Cleaning (Turnover)' : room.status}
                  </span>
                </div>

                {/* Room Type & Details */}
                <div className="mt-3 text-xs">
                  <div className="font-semibold text-slate-200">{room.type}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{room.beds} • {room.size}</div>
                </div>

                {/* Multiple Bookings Indicator Banner */}
                {roomBookings.length > 0 && (
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-amber-300">
                        <History className="w-3 h-3" />
                        {roomBookings.length} {roomBookings.length === 1 ? 'Booking Logged' : 'Bookings Logged'}
                      </span>
                      {room.status === 'cleaning' && checkedOutBookings.length > 0 && (
                        <span className="text-amber-400 font-medium">Recently Checked-Out</span>
                      )}
                    </div>
                    {currentOccupant && (
                      <div className="text-slate-300 truncate">
                        • In-House: <strong className="text-white">{currentOccupant.guest}</strong>
                      </div>
                    )}
                    {upcomingBookings.length > 0 && (
                      <div className="text-indigo-300 truncate">
                        • Next: <strong>{upcomingBookings[0].guest}</strong> ({upcomingBookings[0].checkin})
                      </div>
                    )}
                  </div>
                )}

                {/* Amenities tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {room.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-[10px] text-slate-500">+{room.amenities.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Bottom Actions & Status Selector */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 font-serif text-sm">
                    ₹{room.price.toLocaleString('en-IN')}<span className="text-[10px] font-sans font-normal text-slate-400">/night</span>
                  </span>

                  {/* Quick Status Cycler Dropdown */}
                  <select
                    value={room.status}
                    onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700/60 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="cleaning">Cleaning (Turnover)</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Contextual Action Buttons */}
                {room.status === 'cleaning' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleOpenInspection(room)}
                      title="Open 4-Point Supervisor Checklist and clear room"
                      className="py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Inspect & Ready</span>
                    </button>

                    <button
                      onClick={() => handleBookRoom(room.number)}
                      title="Book this recently checked-out room for the next guest"
                      className="py-1.5 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Book Next</span>
                    </button>
                  </div>
                )}

                {room.status === 'available' && (
                  <button
                    onClick={() => handleBookRoom(room.number)}
                    className="w-full py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book This Suite
                  </button>
                )}

                {(room.status === 'occupied' || room.status === 'maintenance') && (
                  <button
                    onClick={() => handleBookRoom(room.number)}
                    title="Schedule a future booking for this room"
                    className="w-full py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CalendarDays className="w-3 h-3 text-amber-400" />
                    <span>Reserve Next Stay</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4-Point Supervisor Inspection Checklist Modal */}
      {inspectingRoom && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            
            <button
              onClick={() => setInspectingRoom(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20 uppercase tracking-widest font-bold">
                Housekeeping Quality Assurance
              </span>
              <h3 className="text-xl font-bold font-serif text-white mt-1">
                Room #{inspectingRoom.number} Turnover Inspection
              </h3>
              <p className="text-xs text-slate-400">
                {inspectingRoom.type} • Floor {inspectingRoom.floor}
              </p>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <p className="text-slate-300 text-xs font-semibold">
                Verify palace 4-point standards before setting room to Available:
              </p>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.linens}
                  onChange={(e) => setChecklist({ ...checklist, linens: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-200">Fresh Pure Malmal Bedding & Ironed Belgian Linens Fitted</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.toiletries}
                  onChange={(e) => setChecklist({ ...checklist, toiletries: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-200">Forest Essentials Sandalwood Toiletries & Bath Sets Placed</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.teaCopper}
                  onChange={(e) => setChecklist({ ...checklist, teaCopper: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-200">Pure Brass Copper Pitchers & Darjeeling Tea Station Restocked</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.acScent}
                  onChange={(e) => setChecklist({ ...checklist, acScent: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-200">Daikin AC Temperature Preset to 23°C & Scent Diffusers Active</span>
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Supervisor Notes (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Checked by Ramesh Yadav. Room pristine."
                  value={inspectionNote}
                  onChange={(e) => setInspectionNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setInspectingRoom(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmInspection}
                disabled={!checklist.linens || !checklist.toiletries || !checklist.teaCopper || !checklist.acScent}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Pass Inspection & Mark Ready</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
