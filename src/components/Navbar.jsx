import React from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Sparkles, 
  Crown, 
  Search, 
  Plus, 
  ConciergeBell, 
  Hotel, 
  LogOut, 
  ShieldCheck, 
  User,
  Menu,
  X,
  Smartphone,
  Moon
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentUser, 
    currentRole, 
    logout, 
    setIsNewBookingOpen, 
    searchQuery, 
    setSearchQuery,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isDbConnected,
    openGuestPass,
    setIsNightAuditOpen
  } = useHotel();

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>General Manager</span>
          </span>
        );
      case 'reception':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <ConciergeBell className="w-3 h-3 text-indigo-400" />
            <span>Front Office Desk</span>
          </span>
        );
      case 'housekeeping':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Housekeeping</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800/90 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          {/* Mobile Navigation Drawer Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-400/30 shrink-0">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-wide text-lg font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
                RAJVILAS
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Heritage Palace & Resort
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans tracking-tight">
              Heritage Hospitality Operations • Udaipur, Rajasthan
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room, Indian guest, phone (+91), or folio..."
              className="w-full bg-slate-900/90 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl border border-slate-700/60 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition placeholder:text-slate-500 shadow-inner"
            />
          </div>
        </div>

        {/* Authenticated Staff Information & Actions (Strict Privacy - No Cross-Role Switching in Top Panel!) */}
        <div className="flex items-center gap-3">
          
          {/* Live MongoDB Status Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-medium">
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className={isDbConnected ? 'text-emerald-300 font-semibold' : 'text-amber-300'}>
              {isDbConnected ? 'MongoDB Live (Port 5000)' : 'Local Storage Mode'}
            </span>
          </div>

          {/* Guest Digital Keycard Portal Button */}
          <button
            onClick={() => openGuestPass()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700/80 hover:border-amber-500/40 text-xs font-semibold transition cursor-pointer"
            title="Open Royal Digital Room Keycard Pass"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Digital Pass</span>
          </button>

          {/* Automated Night Audit Button (Admin & Reception) */}
          {['admin', 'reception'].includes(currentRole) && (
            <button
              onClick={() => setIsNightAuditOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition cursor-pointer"
              title="Execute Automated Midnight Night Audit"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Night Audit</span>
            </button>
          )}

          {/* New Reservation Button (Admin & Reception only; Hidden for Housekeeping) */}
          {currentRole !== 'housekeeping' && (
            <button
              onClick={() => setIsNewBookingOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden md:inline">+ New Booking</span>
            </button>
          )}

          {/* Secure Logged-in Staff Profile Card */}
          {currentUser && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
                {currentUser.avatar}
              </div>

              <div className="hidden sm:block text-left text-xs leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 block truncate max-w-[140px]">
                    {currentUser.name}
                  </span>
                  {getRoleBadge()}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {currentUser.designation}
                </span>
              </div>

              {/* Secure Sign Out Button */}
              <button
                onClick={logout}
                title={`Signed in as ${currentUser.name} (${currentUser.designation}). Click to sign out.`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 transition cursor-pointer text-xs font-medium ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
