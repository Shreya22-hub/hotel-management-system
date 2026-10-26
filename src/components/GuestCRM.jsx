import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Crown, 
  Users, 
  Search, 
  Filter, 
  Star, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  HeartHandshake, 
  Utensils, 
  Award, 
  History, 
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { formatINR } from '../data/mockData';

// Initial Curated Master Profiles of Rajvilas Heritage Palace Guests
const INITIAL_GUEST_PROFILES = [
  {
    id: 1,
    name: 'Aarav & Meera Kapoor',
    phone: '+91 98201 99888',
    email: 'kapoor.aarav@mumbaicapital.com',
    city: 'Mumbai, Maharashtra',
    totalStays: 4,
    nightsSpent: 16,
    lifetimeSpend: 620000,
    vipTier: 'Maharaja Club',
    dietary: 'Satvik Marwari (No Garlic/Onion on Tuesdays)',
    preferredWing: 'Maharajah Presidential Wing (High Floor)',
    notes: '25th Wedding Anniversary regular. Prefers pure copper pitchers and daily fresh Mogra/Jasmine garlands.'
  },
  {
    id: 2,
    name: 'Vikramaditya Singhania',
    phone: '+91 98100 44556',
    email: 'singhania@singhania-holdings.in',
    city: 'New Delhi',
    totalStays: 3,
    nightsSpent: 11,
    lifetimeSpend: 285000,
    vipTier: 'Maharaja Club',
    dietary: 'Pure Vegetarian (Jain preferences during Navratri)',
    preferredWing: 'Lake Pichola Water View Suite',
    notes: 'Industrialist. Always books luxury chauffeur transfer from Maharana Pratap Airport.'
  },
  {
    id: 3,
    name: 'Col. Arvind Malhotra',
    phone: '+91 98450 11223',
    email: 'col.malhotra@veterans.org.in',
    city: 'Chandigarh',
    totalStays: 3,
    nightsSpent: 9,
    lifetimeSpend: 195000,
    vipTier: 'Gold Royal',
    dietary: 'North Indian Gourmet (Loves Dal Baati Churma)',
    preferredWing: 'Rajputana Heritage Suite',
    notes: 'Retired Army Commander. Prefers morning Darjeeling First Flush tea at 6:30 AM in courtyard.'
  },
  {
    id: 4,
    name: 'Priya Patel',
    phone: '+91 99250 88771',
    email: 'priya.patel@ahmedabad-textiles.in',
    city: 'Ahmedabad, Gujarat',
    totalStays: 2,
    nightsSpent: 6,
    lifetimeSpend: 98000,
    vipTier: 'Gold Royal',
    dietary: 'Pure Gujarati Jain Satvik',
    preferredWing: 'Courtyard Haveli Deluxe',
    notes: 'Special request: Extra Malmal quilts and almond milk nightcaps.'
  },
  {
    id: 5,
    name: 'Rajesh & Sunita Sharma',
    phone: '+91 98111 22334',
    email: 'rajesh.sharma@sharma-exports.in',
    city: 'Jaipur, Rajasthan',
    totalStays: 2,
    nightsSpent: 6,
    lifetimeSpend: 78000,
    vipTier: 'Gold Royal',
    dietary: 'Traditional Rajasthani Vegetarian',
    preferredWing: 'East Courtyard Deluxe',
    notes: 'Annual Diwali & Dussehra palace family retreat.'
  },
  {
    id: 6,
    name: 'Ananya Iyer',
    phone: '+91 98400 33445',
    email: 'ananya.iyer@chennaiconsulting.com',
    city: 'Chennai, Tamil Nadu',
    totalStays: 1,
    nightsSpent: 5,
    lifetimeSpend: 50000,
    vipTier: 'Silver Heritage',
    dietary: 'South Indian Filter Coffee lover / Vegetarian',
    preferredWing: 'Royal Twin Heritage Wing',
    notes: 'Attending destination palace wedding.'
  },
  {
    id: 7,
    name: 'Dr. K. Radhakrishnan',
    phone: '+91 98860 77889',
    email: 'dr.radhakrishnan@bengaluru-health.in',
    city: 'Bengaluru, Karnataka',
    totalStays: 1,
    nightsSpent: 3,
    lifetimeSpend: 28000,
    vipTier: 'Silver Heritage',
    dietary: 'Gluten-Free & Low Spice',
    preferredWing: 'Classic Heritage Courtyard',
    notes: 'Senior medical consultant. Quiet room away from banquet lawns.'
  }
];

export const GuestCRM = () => {
  const { 
    reservations, 
    setIsNewBookingOpen, 
    setPrefilledRoom, 
    searchQuery 
  } = useHotel();

  const [profiles, setProfiles] = useState(INITIAL_GUEST_PROFILES);
  const [selectedTier, setSelectedTier] = useState('all');
  const [search, setSearch] = useState('');
  const [editingGuest, setEditingGuest] = useState(null);

  const activeSearch = search || searchQuery;

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      if (selectedTier !== 'all' && p.vipTier !== selectedTier) return false;
      if (activeSearch) {
        const q = activeSearch.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchPhone = p.phone.includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCity) return false;
      }
      return true;
    });
  }, [profiles, selectedTier, activeSearch]);

  // Aggregate metrics
  const totalGuests = profiles.length;
  const maharajaClubCount = profiles.filter(p => p.vipTier === 'Maharaja Club').length;
  const totalLifetimeSpend = profiles.reduce((sum, p) => sum + p.lifetimeSpend, 0);
  const avgSpendPerGuest = Math.round(totalLifetimeSpend / totalGuests);

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Maharaja Club':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Maharaja Club</span>
          </span>
        );
      case 'Gold Royal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>Gold Royal</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/15 text-slate-300 border border-slate-600/30">
            <Award className="w-3 h-3 text-slate-400" />
            <span>Silver Heritage</span>
          </span>
        );
    }
  };

  const handleQuickReBook = (guest) => {
    setIsNewBookingOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Maharaja Club Members */}
        <div className="bg-[#111726] border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Maharaja Club VIPs</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 mt-2 font-serif">
            {maharajaClubCount} Patrons
          </div>
          <p className="text-xs text-slate-400 mt-1">Royal Tier (Lifetime Spend &gt; ₹2 Lakhs)</p>
        </div>

        {/* Total Tracked Loyalists */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Guest Profiles</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            {totalGuests} Profiles
          </div>
          <p className="text-xs text-slate-400 mt-1">With preferences & cultural records</p>
        </div>

        {/* Avg Lifetime Spend */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Spend / Guest</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-serif">
            {formatINR(avgSpendPerGuest)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Lifetime yield across all palace stays</p>
        </div>

      </div>

      {/* Control & Filter Header */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Maharaja Club — Guest CRM & Palace Loyalty Directory
          </h2>
          <p className="text-xs text-slate-400">
            Guest lifetime spend, royal loyalty status, dietary satvik preferences, and fast repeat booking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search VIP guest, phone, or city..."
              className="bg-slate-900 border border-slate-700/70 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 w-full md:w-60 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/60"
          >
            <option value="all">All Tiers ({profiles.length})</option>
            <option value="Maharaja Club">Maharaja Club (VIP)</option>
            <option value="Gold Royal">Gold Royal</option>
            <option value="Silver Heritage">Silver Heritage</option>
          </select>
        </div>
      </div>

      {/* Guest Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((guest) => {
          return (
            <div 
              key={guest.id}
              className={`bg-[#111726] border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition group hover:shadow-2xl ${
                guest.vipTier === 'Maharaja Club'
                  ? 'border-amber-500/40 hover:border-amber-500/70 bg-gradient-to-b from-[#18141f] to-[#111726]'
                  : guest.vipTier === 'Gold Royal'
                  ? 'border-yellow-500/30 hover:border-yellow-500/60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Tier & City */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  {getTierBadge(guest.vipTier)}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    {guest.city}
                  </span>
                </div>

                {/* Guest Name */}
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition font-serif mt-1">
                  {guest.name}
                </h3>

                {/* Contact details */}
                <div className="space-y-1 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="font-mono text-slate-300">{guest.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                </div>

                {/* Cultural & Dietary Preferences Card */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                    <Utensils className="w-3 h-3 text-amber-400" />
                    <span>Dietary & Dining Notes:</span>
                  </div>
                  <p className="text-slate-300 leading-tight">
                    {guest.dietary}
                  </p>

                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    Preferred Wing: <span className="text-slate-300 font-medium">{guest.preferredWing}</span>
                  </div>
                </div>

                {/* Special VIP Request */}
                {guest.notes && (
                  <p className="text-[11px] text-amber-200/80 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 italic mt-2.5">
                    "{guest.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Metrics & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Lifetime Spend</span>
                  <span className="font-bold text-amber-400 font-serif text-sm">
                    {formatINR(guest.lifetimeSpend)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {guest.totalStays} stays ({guest.nightsSpent} nights)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickReBook(guest)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Stay</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
