import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Bed, 
  FileText, 
  Printer, 
  Plus, 
  Clock, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  PieChart
} from 'lucide-react';

export const AnalyticsReports = () => {
  const { kpis, rooms, bills, logs, addLog, currentRole } = useHotel();
  const [newLogMessage, setNewLogMessage] = useState('');
  const [newLogCategory, setNewLogCategory] = useState('Front Desk');

  // Breakdown by room category
  const categoryStats = useMemo(() => {
    const cats = ['Single', 'Double', 'Suite'];
    return cats.map(cat => {
      const catRooms = rooms.filter(r => r.category === cat);
      const total = catRooms.length;
      const occupied = catRooms.filter(r => r.status === 'occupied').length;
      const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
      const avgPrice = total > 0 ? Math.round(catRooms.reduce((sum, r) => sum + r.price, 0) / total) : 0;

      return {
        category: cat,
        total,
        occupied,
        rate,
        avgPrice
      };
    });
  }, [rooms]);

  const handleAddLogSubmit = (e) => {
    e.preventDefault();
    if (!newLogMessage.trim()) return;
    addLog(newLogMessage.trim(), newLogCategory);
    setNewLogMessage('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Print Action */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Hospitality Analytics & Operational Shift Logbook
          </h2>
          <p className="text-xs text-slate-400">
            Performance indicators (RevPAR, ADR), yield breakdown, and cross-departmental communications
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print Management Brief</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RevPAR */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">RevPAR</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            ₹{kpis.revpar.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">Revenue Per Available Room</p>
        </div>

        {/* ADR */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ADR (Average Daily Rate)</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            ₹{kpis.adr.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">Average occupied room yield</p>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Occupancy Yield</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-serif">
            {kpis.occupancyRate}%
          </div>
          <p className="text-xs text-slate-400 mt-1">{kpis.occupiedCount} of {kpis.totalRooms} rooms occupied</p>
        </div>

        {/* Gross Revenue */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled Billing</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-300 mt-2 font-serif">
            ₹{kpis.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">+₹{kpis.pendingRevenue.toLocaleString('en-IN')} in pending accounts</p>
        </div>
      </div>

      {/* Category Breakdown & Shift Logbook 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Performance (5 cols) */}
        <div className="lg:col-span-5 bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                Performance by Room Tier
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">30 TOTAL UNITS</span>
            </div>

            <div className="space-y-4">
              {categoryStats.map(stat => (
                <div key={stat.category} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white">{stat.category} Accommodations</span>
                    <span className="text-amber-400 font-bold font-mono">{stat.rate}% Occupancy</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${stat.rate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{stat.occupied} of {stat.total} units occupied</span>
                    <span>Avg Rate: <strong className="text-slate-200 font-mono">₹{stat.avgPrice.toLocaleString('en-IN')}/nt</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/50 rounded-xl border border-slate-800/80 mt-6 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Revenue Yield Insight</span>
            </div>
            Suite bookings account for 64% of total hotel gross revenue despite representing 33% of room inventory.
          </div>
        </div>

        {/* Operational Shift Logbook (7 cols) */}
        <div className="lg:col-span-7 bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              Operational Shift Handover Log
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">{logs.length} ENTRIES</span>
          </div>

          {/* Add Log Form */}
          <form onSubmit={handleAddLogSubmit} className="mb-5 p-3 rounded-xl bg-slate-900 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Add Handover / Incident Note:</span>
              <select
                value={newLogCategory}
                onChange={(e) => setNewLogCategory(e.target.value)}
                className="bg-slate-800 text-slate-300 text-[11px] rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-amber-500"
              >
                <option value="Front Desk">Front Desk</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Executive">Executive</option>
                <option value="Concierge">Concierge</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLogMessage}
                onChange={(e) => setNewLogMessage(e.target.value)}
                placeholder="Log operational update, VIP preference, or maintenance request..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Log</span>
              </button>
            </div>
          </form>

          {/* Logs List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/90 transition text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{log.author}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700/80">
                      {log.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {log.time}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {log.message}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
