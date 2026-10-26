import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { TimelineCalendar } from './components/TimelineCalendar';
import { RoomMatrix } from './components/RoomMatrix';
import { ReservationsDesk } from './components/ReservationsDesk';
import { BillingFolio } from './components/BillingFolio';
import { InventoryTracker } from './components/InventoryTracker';
import { AnalyticsReports } from './components/AnalyticsReports';
import { GuestCRM } from './components/GuestCRM';
import { RoyalExperiences } from './components/RoyalExperiences';
import { NewBookingModal } from './components/NewBookingModal';
import { BookingDetailsModal } from './components/BookingDetailsModal';
import { GuestDigitalPassModal } from './components/GuestDigitalPassModal';
import { NightAuditModal } from './components/NightAuditModal';
import { LoginView } from './components/LoginView';

const HotelAppContent = () => {
  const { currentUser, activeTab } = useHotel();

  // If staff is not authenticated, display login portal
  if (!currentUser) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    // Strict Role Enforcement & Privacy Protection:
    // 1. Receptionist CANNOT access Admin Executive Dashboard
    if (activeTab === 'dashboard') {
      if (currentUser.role !== 'admin') {
        return <TimelineCalendar />;
      }
      return <DashboardOverview />;
    }

    // 2. Housekeeping CANNOT access Receptionist (Timeline, Bookings, Guests CRM, Experiences, Billing) or Admin views
    if (currentUser.role === 'housekeeping') {
      if (['dashboard', 'timeline', 'reservations', 'guests', 'experiences', 'billing'].includes(activeTab)) {
        return <RoomMatrix />;
      }
    }

    switch (activeTab) {
      case 'timeline':
        return <TimelineCalendar />;
      case 'rooms':
        return <RoomMatrix />;
      case 'reservations':
        return <ReservationsDesk />;
      case 'guests':
        return <GuestCRM />;
      case 'experiences':
        return <RoyalExperiences />;
      case 'billing':
        return <BillingFolio />;
      case 'inventory':
        return <InventoryTracker />;
      case 'reports':
        return <AnalyticsReports />;
      default:
        if (currentUser.role === 'admin') return <DashboardOverview />;
        if (currentUser.role === 'reception') return <TimelineCalendar />;
        return <RoomMatrix />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 antialiased">
      {/* Top Luxury Navigation with User Profile & Sign Out */}
      <Navbar />

      {/* Main App Workspace */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav filtered by staff role */}
        <Sidebar />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <NewBookingModal />
      <BookingDetailsModal />
      <GuestDigitalPassModal />
      <NightAuditModal />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <HotelAppContent />
    </HotelProvider>
  );
}
