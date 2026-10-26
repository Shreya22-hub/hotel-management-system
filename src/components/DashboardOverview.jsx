import React from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Building2, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  ArrowUpRight, 
  Bed, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Calendar,
  Layers,
  Moon,
  Compass,
  Smartphone
} from 'lucide-react';

export const DashboardOverview = () => {
  const { 
    kpis, 
    rooms, 
    reservations, 
    logs, 
    setActiveTab, 
    setSelectedBooking,
    setIsNightAuditOpen,
    openGuestPass
  } = useHotel();

  return (
    <div className="space-y-6">
      
      {/* Executive Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f1422] border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2">
            <span>Executive General Manager Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time palace operations, RevPAR analytics, and midnight audit controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('experiences')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Palace Experiences</span>
          </button>

          <button
            onClick={() => openGuestPass()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Digital Keycard</span>
          </button>

          <button
            onClick={() => setIsNightAuditOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Run Night Audit</span>
          </button>
        </div>
      </div>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Occupancy Card */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Occupancy Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            {kpis.occupancyRate}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{kpis.occupiedCount} of {kpis.totalRooms} rooms occupied</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all"
              style={{ width: `${kpis.occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Total Settled Revenue */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            ₹{kpis.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span>Pending settlement: <strong className="text-amber-400 font-mono">₹{kpis.pendingRevenue.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

        {/* ADR & RevPAR (Boutique Hospitality Metrics) */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ADR / RevPAR</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            ₹{kpis.adr.toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-400 font-sans">/ ₹{kpis.revpar.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 mt-2">
            <span>Avg Daily Rate & Rev per Available Room</span>
          </div>
        </div>

        {/* Turnover & Stock Alerts */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operational Attention</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            {kpis.cleaningCount + kpis.lowStockCount} <span className="text-sm font-normal text-slate-400 font-sans">items</span>
          </div>
          <div className="flex items-center gap-2 text-xs mt-2">
            <span className="text-amber-400">{kpis.cleaningCount} Turnover</span>
            <span className="text-slate-600">•</span>
            <span className="text-rose-400">{kpis.lowStockCount} Low Stock</span>
          </div>
        </div>

      </div>

      {/* Center Layout: Quick Room Monitor + Live Logbook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Room Matrix Status Snapshot */}
        <div className="lg:col-span-2 bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Live Room Matrix Status
                </h3>
                <p className="text-xs text-slate-400">Interactive overview across all 30 suites and deluxe rooms</p>
              </div>
              <button
                onClick={() => setActiveTab('rooms')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                Open Full Matrix →
              </button>
            </div>

            {/* Quick Room Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {rooms.slice(0, 18).map(room => (
                <div
                  key={room.id}
                  onClick={() => setActiveTab('timeline')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition transform hover:scale-105 shadow-md ${
                    room.status === 'occupied'
                      ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                      : room.status === 'cleaning'
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                      : room.status === 'maintenance'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  }`}
                  title={`Room #${room.number} (${room.type}) - ${room.status}`}
                >
                  <div className="font-mono font-bold text-sm text-white">#{room.number}</div>
                  <div className="text-[10px] uppercase font-semibold mt-0.5 tracking-tight truncate">
                    {room.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Available ({kpis.availableCount})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Occupied ({kpis.occupiedCount})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cleaning ({kpis.cleaningCount})</span>
            </div>
            <button
              onClick={() => setActiveTab('timeline')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View on Timeline →
            </button>
          </div>
        </div>

        {/* Live Operational Incident & Handover Log */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Operational Stream
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[290px] pr-1">
            {logs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-400/90">{log.author}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{log.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent High-Profile Bookings */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-100">Active VIP In-House Guests</h3>
            <p className="text-xs text-slate-400">Currently occupying suites with special requests</p>
          </div>
          <button
            onClick={() => setActiveTab('reservations')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            View All Reservations →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reservations.slice(0, 3).map(res => (
            <div 
              key={res.id} 
              onClick={() => setSelectedBooking(res)}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400">Room #{res.room}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                  {res.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-100 text-sm truncate">{res.guest}</h4>
              <p className="text-slate-400 text-xs mt-1">
                {res.checkin} → {res.checkout}
              </p>
              {res.notes && (
                <div className="mt-2 text-[11px] text-amber-300/80 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 truncate">
                  ★ {res.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
