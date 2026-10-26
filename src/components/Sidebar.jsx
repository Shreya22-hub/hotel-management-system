import React from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BedDouble, 
  Users, 
  CreditCard, 
  Package, 
  BarChart3,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Crown,
  Compass,
  Moon,
  Smartphone
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentRole, 
    kpis, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    openGuestPass,
    setIsNightAuditOpen
  } = useHotel();

  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, roles: ['admin'], badge: null },
    { id: 'timeline', label: 'Timeline & Calendar', icon: CalendarDays, roles: ['admin', 'reception'], badge: 'Live View' },
    { id: 'reservations', label: 'Guest Bookings', icon: Users, roles: ['admin', 'reception'], badge: null },
    { id: 'guests', label: 'Guest CRM & VIP Club', icon: Crown, roles: ['admin', 'reception'], badge: 'Maharaja' },
    { id: 'experiences', label: 'Palace Experiences', icon: Compass, roles: ['admin', 'reception'], badge: 'Curated' },
    { id: 'billing', label: 'Folio & Billing', icon: CreditCard, roles: ['admin', 'reception'], badge: kpis.pendingRevenue > 0 ? `₹${kpis.pendingRevenue.toLocaleString('en-IN')}` : null },
    { id: 'rooms', label: 'Rooms & Matrix', icon: BedDouble, roles: ['admin', 'reception', 'housekeeping'], badge: `${kpis.cleaningCount} dirty` },
    { id: 'inventory', label: 'Housekeeping Stock', icon: Package, roles: ['admin', 'reception', 'housekeeping'], badge: kpis.lowStockCount > 0 ? `${kpis.lowStockCount} low` : null },
    { id: 'reports', label: 'Analytics & Logs', icon: BarChart3, roles: ['admin', 'reception', 'housekeeping'], badge: null }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentRole));

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden" 
        />
      )}

      <aside className={`
        ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl flex' : 'hidden'} 
        md:flex md:static md:w-64 bg-[#0d121f] border-r border-slate-800/80 p-4 flex-col justify-between shrink-0 transition-all
      `}>
        
        {/* Navigation Links */}
        <div className="space-y-6">
          <div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-3 mb-2">
              Operations & Control
            </div>
            <nav className="space-y-1">
              {filteredItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent text-amber-300 border-l-2 border-amber-400 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.badge.includes('dirty') || item.badge.includes('low')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : item.badge.includes('₹') || item.badge.includes('$')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Live Hotel Status Mini-Widget */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/80 rounded-2xl p-3.5 border border-slate-800/80 shadow-lg">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Occupancy</span>
              <span className="font-bold text-amber-400">{kpis.occupancyRate}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${kpis.occupancyRate}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/60">
              <div>
                <span className="text-slate-500 block">Available</span>
                <span className="font-bold text-emerald-400">{kpis.availableCount} rooms</span>
              </div>
              <div>
                <span className="text-slate-500 block">Turnover</span>
                <span className="font-bold text-amber-400">{kpis.cleaningCount} cleaning</span>
              </div>
            </div>
          </div>

          {/* Quick Operations Triggers */}
          <div className="space-y-1.5">
            <button
              onClick={() => {
                openGuestPass();
                if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-semibold transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Guest Digital Pass</span>
            </button>

            {['admin', 'reception'].includes(currentRole) && (
              <button
                onClick={() => {
                  setIsNightAuditOpen(true);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition cursor-pointer"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Run Night Audit</span>
              </button>
            )}
          </div>
        </div>

        {/* Role Footer Banner */}
        <div className="pt-4 border-t border-slate-800/80 mt-auto">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-[11px]">
              <span className="text-slate-400 block leading-tight">Current Session:</span>
              <span className="font-semibold text-slate-200 capitalize">
                {currentRole} Mode Active
              </span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
