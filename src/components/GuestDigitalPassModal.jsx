import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  X, 
  Smartphone, 
  Wifi, 
  KeyRound, 
  ShieldCheck, 
  Crown, 
  Calendar, 
  MapPin, 
  Printer, 
  Copy, 
  Check, 
  Phone, 
  MessageSquare, 
  Sparkles,
  Lock,
  Unlock,
  CreditCard
} from 'lucide-react';
import { formatINR } from '../data/mockData';

export const GuestDigitalPassModal = () => {
  const { 
    isGuestPassOpen, 
    setIsGuestPassOpen, 
    guestPassBooking, 
    reservations, 
    rooms, 
    bills,
    setGuestPassBooking
  } = useHotel();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  if (!isGuestPassOpen) return null;

  // Fallback to currently selected booking or first active checked-in booking
  const activeBooking = guestPassBooking || reservations.find(r => r.status === 'checked-in') || reservations[0];
  const roomInfo = rooms.find(r => r.number === activeBooking?.room);
  const guestBill = bills.find(b => b.resId === activeBooking?.id || (b.room === activeBooking?.room && b.guest === activeBooking?.guest));

  const handleSimulateNfcTap = () => {
    setUnlocking(true);
    setTimeout(() => {
      setUnlocking(false);
      setIsUnlocked(prev => !prev);
    }, 800);
  };

  const handleCopyWifi = () => {
    navigator.clipboard.writeText('MewarRoyalty2026').then(() => {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b0f19] border border-amber-500/40 rounded-3xl w-full max-w-md shadow-2xl p-6 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsGuestPassOpen(false);
            setIsUnlocked(false);
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Guest Selector Header */}
        <div className="border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Contactless Luxury Guest Portal</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif text-white">
              Royal Digital Room Keycard
            </h3>
            {/* Quick Guest Switcher */}
            <select
              value={activeBooking?.id || ''}
              onChange={(e) => {
                const found = reservations.find(r => r.id === parseInt(e.target.value));
                if (found) {
                  setGuestPassBooking(found);
                  setIsUnlocked(false);
                }
              }}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 max-w-[140px] truncate focus:outline-none"
            >
              {reservations.map(r => (
                <option key={r.id} value={r.id}>
                  Room {r.room} - {r.guest}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 💳 Luxury Digital Wallet Pass Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1b2238] via-[#101628] to-[#0a0d18] border-2 border-amber-500/60 p-5 shadow-2xl space-y-4">
          
          {/* Gold Shimmer Overlay */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-400/10 blur-[60px] pointer-events-none rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-600/10 blur-[60px] pointer-events-none rounded-full" />

          {/* Card Top: Palace Crest & VIP Tier */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center shadow-md">
                <Crown className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-semibold block">
                  Rajvilas Heritage Palace
                </span>
                <span className="text-[9px] text-slate-400 font-serif">
                  Udaipur, Rajasthan • Estd. 1892
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              VIP Pass
            </span>
          </div>

          {/* Guest Name & Chamber Number */}
          <div className="pt-2 relative z-10">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block">
              Honoured Palace Guest
            </span>
            <div className="text-xl font-bold font-serif text-white tracking-wide">
              {activeBooking?.guest || 'Royal Guest'}
            </div>
            <div className="mt-2 p-3 bg-slate-900/80 border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Chamber Assigned</span>
                <span className="text-2xl font-bold font-serif text-amber-300">
                  Room #{activeBooking?.room}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Suite Category</span>
                <span className="text-xs font-semibold text-slate-200">
                  {roomInfo?.type || 'Royal Suite'}
                </span>
              </div>
            </div>
          </div>

          {/* Stay Timeline & Verification */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 relative z-10">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Check-In</span>
              <span className="font-semibold text-slate-200">{activeBooking?.checkin}</span>
              <span className="text-[9px] text-amber-400 block mt-0.5">From 2:00 PM</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Check-Out</span>
              <span className="font-semibold text-slate-200">{activeBooking?.checkout}</span>
              <span className="text-[9px] text-amber-400 block mt-0.5">Until 11:00 AM</span>
            </div>
          </div>

          {/* 🔑 Interactive RFID / NFC Door Lock Simulator */}
          <div className="relative z-10 pt-1">
            <button
              onClick={handleSimulateNfcTap}
              disabled={unlocking}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                isUnlocked
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {unlocking ? (
                <span className="flex items-center gap-1.5 animate-pulse">
                  <Smartphone className="w-4 h-4 animate-bounce" />
                  <span>Transmitting Encrypted NFC Signal...</span>
                </span>
              ) : isUnlocked ? (
                <span className="flex items-center gap-1.5">
                  <Unlock className="w-4 h-4 text-slate-950" />
                  <span>Chamber #{activeBooking?.room} Unlocked • Tap to Relock</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-slate-950" />
                  <span>Tap Phone to Palace Room Door Lock (NFC)</span>
                </span>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1">
              {isUnlocked ? '🟢 Brass Smart Lock engaged. Room entry authorized.' : 'High-security 256-bit AES encrypted palace keyless entry.'}
            </p>
          </div>

          {/* Wi-Fi & Credentials */}
          <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-1 relative z-10">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Wifi className="w-3.5 h-3.5 text-sky-400" />
                <span>Wi-Fi Network:</span>
              </span>
              <span className="font-mono font-bold text-white">Rajvilas_Palace_5G</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Password:</span>
              <button
                onClick={handleCopyWifi}
                className="font-mono text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>MewarRoyalty2026</span>
                {copiedWifi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Verification Pill */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 relative z-10">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity Verified ({activeBooking?.idType || 'Aadhaar'})</span>
            </span>
            <span className="font-mono text-slate-400">Pass #RV-{activeBooking?.id}-2026</span>
          </div>

        </div>

        {/* Concierge Hotline & Print Bar */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>

          <a
            href="https://api.whatsapp.com/send?phone=912942488900&text=Namaste%20Rajvilas%20Concierge,%20I%20am%20in-house%20guest."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Butler Desk</span>
          </a>
        </div>

      </div>
    </div>
  );
};
