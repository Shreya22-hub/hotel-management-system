import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  STAFF_ACCOUNTS, 
  INITIAL_ROOMS, 
  INITIAL_RESERVATIONS, 
  INITIAL_BILLS, 
  INITIAL_INVENTORY, 
  INITIAL_LOGS,
  INITIAL_EXPERIENCES,
  INITIAL_EXPERIENCE_BOOKINGS,
  POPULAR_EXTRA_CHARGES,
  formatINR,
  formatINRCurrency
} from '../data/mockData';
import { api } from '../services/api';

const HotelContext = createContext(null);

export const HotelProvider = ({ children }) => {
  // Database Live Connection State
  const [isDbConnected, setIsDbConnected] = useState(false);
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rajvilas_user');
      if (saved) return JSON.parse(saved);
      return null;
    } catch (e) {
      return null;
    }
  });

  const currentRole = currentUser ? currentUser.role : null; // 'admin', 'reception', 'housekeeping' or null

  // Tab navigation
  const [activeTab, setActiveTab] = useState(() => {
    if (currentRole === 'reception') return 'timeline';
    if (currentRole === 'housekeeping') return 'rooms';
    return 'dashboard';
  });
  
  // Hotel Data with LocalStorage Persistence
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('rajvilas_rooms');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch (e) {
      return INITIAL_ROOMS;
    }
  });

  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('rajvilas_reservations');
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch (e) {
      return INITIAL_RESERVATIONS;
    }
  });

  const [bills, setBills] = useState(() => {
    try {
      const saved = localStorage.getItem('rajvilas_bills');
      return saved ? JSON.parse(saved) : INITIAL_BILLS;
    } catch (e) {
      return INITIAL_BILLS;
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('rajvilas_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch (e) {
      return INITIAL_INVENTORY;
    }
  });

  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('rajvilas_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch (e) {
      return INITIAL_LOGS;
    }
  });

  // Royal Experiences & Concierge Bookings
  const [experiences] = useState(INITIAL_EXPERIENCES);
  const [experienceBookings, setExperienceBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('rajvilas_experiences');
      return saved ? JSON.parse(saved) : INITIAL_EXPERIENCE_BOOKINGS;
    } catch (e) {
      return INITIAL_EXPERIENCE_BOOKINGS;
    }
  });

  // Guest Digital Keycard Modal State
  const [isGuestPassOpen, setIsGuestPassOpen] = useState(false);
  const [guestPassBooking, setGuestPassBooking] = useState(null);

  // Automated Night Audit State
  const [isNightAuditOpen, setIsNightAuditOpen] = useState(false);
  const [lastNightAudit, setLastNightAudit] = useState(() => {
    try {
      const saved = localStorage.getItem('rajvilas_night_audit');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [prefilledRoom, setPrefilledRoom] = useState(null);
  const [prefilledDate, setPrefilledDate] = useState(null);
  const [selectedBillToView, setSelectedBillToView] = useState(null);

  // Auto-persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rajvilas_rooms', JSON.stringify(rooms));
    } catch (e) {}
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem('rajvilas_reservations', JSON.stringify(reservations));
    } catch (e) {}
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem('rajvilas_bills', JSON.stringify(bills));
    } catch (e) {}
  }, [bills]);

  useEffect(() => {
    try {
      localStorage.setItem('rajvilas_inventory', JSON.stringify(inventory));
    } catch (e) {}
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem('rajvilas_logs', JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem('rajvilas_experiences', JSON.stringify(experienceBookings));
    } catch (e) {}
  }, [experienceBookings]);

  // Sync live state from MongoDB Backend (auto-polls every 6 seconds for live multi-device synchronization)
  useEffect(() => {
    let isMounted = true;

    const fetchLiveDatabase = async () => {
      try {
        const health = await api.checkHealth();
        if (health && health.status === 'online') {
          if (isMounted) setIsDbConnected(true);

          const [dbRooms, dbRes, dbBills, dbInv, dbLogs] = await Promise.all([
            api.getRooms(),
            api.getReservations(),
            api.getBills(),
            api.getInventory(),
            api.getLogs()
          ]);

          if (isMounted) {
            if (dbRooms && dbRooms.length) setRooms(dbRooms);
            if (dbRes && dbRes.length) setReservations(dbRes);
            if (dbBills && dbBills.length) setBills(dbBills);
            if (dbInv && dbInv.length) setInventory(dbInv);
            if (dbLogs && dbLogs.length) setLogs(dbLogs);
          }
        }
      } catch (err) {
        if (isMounted) setIsDbConnected(false);
      }
    };

    fetchLiveDatabase();
    const interval = setInterval(fetchLiveDatabase, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Enforce role restrictions on active tab
  useEffect(() => {
    if (currentRole === 'reception' && activeTab === 'dashboard') {
      setActiveTab('timeline');
    } else if (currentRole === 'housekeeping' && ['dashboard', 'timeline', 'reservations', 'billing'].includes(activeTab)) {
      setActiveTab('rooms');
    }
  }, [currentRole, activeTab]);

  // Reset to Factory Default Data
  const resetFactoryData = () => {
    try {
      localStorage.removeItem('rajvilas_rooms');
      localStorage.removeItem('rajvilas_reservations');
      localStorage.removeItem('rajvilas_bills');
      localStorage.removeItem('rajvilas_inventory');
      localStorage.removeItem('rajvilas_logs');
    } catch (e) {}

    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setBills(INITIAL_BILLS);
    setInventory(INITIAL_INVENTORY);
    setLogs(INITIAL_LOGS);

    api.resetDatabase().catch(() => {});
    addLog('System database reset to initial factory state', 'Security');
  };

  // Authentication Handlers
  const login = async (username, password) => {
    // Try online MongoDB authentication first
    try {
      const res = await api.login(username, password);
      if (res && res.success) {
        setCurrentUser(res.user);
        try { localStorage.setItem('rajvilas_user', JSON.stringify(res.user)); } catch (e) {}
        if (res.user.role === 'admin') setActiveTab('dashboard');
        else if (res.user.role === 'reception') setActiveTab('timeline');
        else if (res.user.role === 'housekeeping') setActiveTab('rooms');
        addLog(`${res.user.name} (${res.user.designation}) logged into terminal via MongoDB`, 'Security');
        return { success: true };
      }
    } catch (e) {
      // Graceful offline fallback
    }

    const matched = STAFF_ACCOUNTS.find(
      acc => acc.username.toLowerCase() === username.trim().toLowerCase() && acc.password === password
    );

    if (matched) {
      setCurrentUser(matched);
      try {
        localStorage.setItem('rajvilas_user', JSON.stringify(matched));
      } catch (e) {}

      if (matched.role === 'admin') {
        setActiveTab('dashboard');
      } else if (matched.role === 'reception') {
        setActiveTab('timeline');
      } else if (matched.role === 'housekeeping') {
        setActiveTab('rooms');
      }

      addLog(`${matched.name} (${matched.designation}) logged into terminal`, 'Security');
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Invalid staff username or password. Please use the demo credentials below.' 
    };
  };

  const logout = () => {
    if (currentUser) {
      addLog(`${currentUser.name} signed out of staff terminal`, 'Security');
    }
    api.logout();
    setCurrentUser(null);
    try {
      localStorage.removeItem('rajvilas_user');
      localStorage.removeItem('rajvilas_token');
    } catch (e) {}
  };

  // Room status updater
  const updateRoomStatus = (roomId, newStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    const roomNum = rooms.find(r => r.id === roomId)?.number || roomId;
    api.updateRoomStatus(roomId, newStatus).catch(() => {});
    addLog(`Room ${roomNum} status updated to ${newStatus.toUpperCase()}`, 'Housekeeping');
  };

  // 4-Point Supervisor Inspection & Turnover completion
  const completeInspectionAndClean = (roomNumber, checklistNotes = '') => {
    setRooms(prev => prev.map(r => r.number === parseInt(roomNumber) ? { ...r, status: 'available' } : r));
    api.inspectRoom(roomNumber, checklistNotes).catch(() => {});
    addLog(`4-Point Inspection Passed for Room ${roomNumber}. Room sanitized & ready for guest arrival. ${checklistNotes}`, 'Housekeeping');
  };

  // Add Reservation
  const addReservation = (newResData) => {
    const newId = reservations.length ? Math.max(...reservations.map(r => r.id)) + 1 : 1;
    const newRes = {
      id: newId,
      idType: newResData.idType || 'Aadhaar Card',
      idNumber: newResData.idNumber || 'Not Provided',
      idVerified: Boolean(newResData.idVerified),
      ...newResData
    };
    
    // Add to reservations (allowing multiple bookings on the same room)
    setReservations(prev => [newRes, ...prev]);

    // If check-in is today or currently active, update room status to occupied
    const todayStr = '2026-10-24';
    if (newResData.checkin <= todayStr && newResData.checkout > todayStr) {
      setRooms(prev => prev.map(r => r.number === parseInt(newResData.room) ? { ...r, status: 'occupied' } : r));
    }

    // Auto-create bill folio with 12% Indian GST (6% CGST + 6% SGST)
    const billId = 1000 + newId;
    const grossRoomCharges = newResData.grossAmount || newResData.totalAmount;
    const discount = newResData.discount || 0;
    const netRoomCharges = Math.max(0, grossRoomCharges - discount);
    const taxes = Math.round(netRoomCharges * 0.12);
    
    const billItems = [
      { 
        id: 1, 
        description: `Room Tariff (${newResData.checkin} → ${newResData.checkout})`, 
        amount: grossRoomCharges, 
        date: newResData.checkin 
      }
    ];

    if (discount > 0) {
      billItems.push({
        id: 2,
        description: `Royal Promo Savings (${newResData.promoCode || 'PROMO'})`,
        amount: -discount,
        date: newResData.checkin
      });
    }

    setBills(prev => [
      {
        id: billId,
        resId: newId,
        guest: newResData.guest,
        room: newResData.room,
        roomCharges: netRoomCharges,
        extraCharges: 0,
        taxes: taxes,
        total: netRoomCharges + taxes,
        status: 'pending',
        paymentMethod: 'UPI / Credit Card Pre-auth',
        date: newResData.checkin,
        items: billItems
      },
      ...prev
    ]);

    // Persist to MongoDB
    api.createReservation(newResData).catch(() => {});
    const promoNote = newResData.promoCode ? ` [Promo applied: ${newResData.promoCode}]` : '';
    addLog(`New booking #${newId} confirmed for ${newResData.guest} in Room ${newResData.room}${promoNote}`, 'Front Desk');
  };

  // Update reservation status (check in, check out, cancel)
  const updateReservationStatus = (resId, newStatus) => {
    setReservations(prev => prev.map(r => {
      if (r.id === resId) {
        if (newStatus === 'checked-out') {
          setRooms(rPrev => rPrev.map(rm => rm.number === r.room ? { ...rm, status: 'cleaning' } : rm));
          addLog(`Guest ${r.guest} checked out of Room ${r.room}. Room flagged for housekeeping turnover.`, 'Front Desk');
        } else if (newStatus === 'checked-in') {
          setRooms(rPrev => rPrev.map(rm => rm.number === r.room ? { ...rm, status: 'occupied' } : rm));
          addLog(`Guest ${r.guest} checked in to Room ${r.room}.`, 'Front Desk');
        }
        return { ...r, status: newStatus };
      }
      return r;
    }));
    api.updateReservationStatus(resId, newStatus).catch(() => {});
  };

  // Cancel Reservation & Release Room
  const cancelReservation = (resId, reason = 'Guest Cancellation Request') => {
    let affectedRoom = null;
    let guestName = '';

    setReservations(prev => prev.map(r => {
      if (r.id === resId) {
        affectedRoom = r.room;
        guestName = r.guest;
        if (r.status === 'checked-in') {
          setRooms(rPrev => rPrev.map(rm => rm.number === r.room ? { ...rm, status: 'cleaning' } : rm));
        }
        return { 
          ...r, 
          status: 'cancelled', 
          cancellationReason: reason,
          cancelledAt: new Date().toISOString() 
        };
      }
      return r;
    }));

    api.cancelReservation(resId, reason).catch(() => {});
    addLog(`Reservation #${resId} for ${guestName} (Room ${affectedRoom}) CANCELLED. Reason: ${reason}. Room released.`, 'Front Desk');
  };

  // Express Settle Folio & Check-Out in 1 action
  const settleAndCheckout = (resId, paymentMethod = 'UPI / Card at Express Checkout') => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    setBills(prev => prev.map(b => {
      if (b.resId === resId || (b.room === res.room && b.guest === res.guest)) {
        return {
          ...b,
          status: 'paid',
          paymentMethod: paymentMethod || b.paymentMethod
        };
      }
      return b;
    }));

    updateReservationStatus(resId, 'checked-out');
    api.settleCheckout(resId, paymentMethod).catch(() => {});
    addLog(`Folio settled in full & Express Check-Out completed for ${res.guest} (Room ${res.room})`, 'Front Desk');
  };

  // Direct Bridge: Jump from Booking to Billing Folio
  const openFolioForBooking = (resId) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    const matchedBill = bills.find(b => b.resId === resId || (b.room === res.room && b.guest === res.guest));
    if (matchedBill) {
      setSelectedBillToView(matchedBill);
    }
    setSelectedBooking(null);
    setActiveTab('billing');
  };

  // Verify Guest Government ID at Check-In
  const verifyGuestId = (resId, idType, idNumber) => {
    setReservations(prev => prev.map(r => {
      if (r.id === resId) {
        return {
          ...r,
          idType: idType || r.idType,
          idNumber: idNumber || r.idNumber,
          idVerified: true
        };
      }
      return r;
    }));
    api.verifyId(resId, idType, idNumber).catch(() => {});
    addLog(`Government ID (${idType || 'Aadhaar'}) verified for reservation #${resId}`, 'Front Desk');
  };

  // Add Extra Charge to Guest Folio (e.g. In-Room Dining, Spa, Chauffeur)
  const addExtraChargeToFolio = (billId, description, amount) => {
    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        const newExtra = b.extraCharges + amount;
        const newTaxes = Math.round((b.roomCharges + newExtra) * 0.12);
        const newTotal = b.roomCharges + newExtra + newTaxes;
        const newItem = {
          id: Date.now(),
          description,
          amount,
          date: '2026-10-24'
        };

        const updatedItems = b.items ? [...b.items, newItem] : [newItem];

        return {
          ...b,
          extraCharges: newExtra,
          taxes: newTaxes,
          total: newTotal,
          items: updatedItems
        };
      }
      return b;
    }));

    api.addExtraCharge(billId, description, amount).catch(() => {});
    const bill = bills.find(b => b.id === billId);
    addLog(`Added ₹${amount.toLocaleString('en-IN')} charge (${description}) to Room ${bill ? bill.room : ''} Folio #${billId}`, 'Front Desk');
  };

  // Toggle bill status
  const toggleBillStatus = (billId) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: b.status === 'paid' ? 'pending' : 'paid' } : b));
    api.toggleBillStatus(billId).catch(() => {});
  };

  // Book Curated Royal Palace Experience
  const bookExperience = (resId, experienceId, date, timeSlot, guestsCount = 2, notes = '') => {
    const res = reservations.find(r => r.id === parseInt(resId));
    const exp = INITIAL_EXPERIENCES.find(e => e.id === experienceId);
    if (!res || !exp) return { success: false, message: 'Reservation or Experience not found.' };

    const multiplier = exp.priceUnit.includes('per guest') ? parseInt(guestsCount) : 1;
    const totalAmount = exp.price * multiplier;

    // Post charge directly to guest folio if active bill exists
    const guestBill = bills.find(b => b.resId === res.id || (b.room === res.room && b.guest === res.guest));
    if (guestBill) {
      addExtraChargeToFolio(guestBill.id, `${exp.title} (${date || 'Today'})`, totalAmount);
    }

    const newBookingId = `EXP-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord = {
      id: newBookingId,
      experienceId: exp.id,
      title: exp.title,
      guest: res.guest,
      room: res.room,
      resId: res.id,
      date: date || '2026-10-24',
      timeSlot: timeSlot || exp.timing,
      guestsCount: parseInt(guestsCount),
      amount: totalAmount,
      status: 'confirmed',
      notes: notes.trim()
    };

    setExperienceBookings(prev => [newRecord, ...prev]);
    addLog(`Royal Experience "${exp.title}" booked for ${res.guest} (Room ${res.room}) — ₹${totalAmount.toLocaleString('en-IN')}`, 'Concierge');
    return { success: true, booking: newRecord };
  };

  // Open Guest Digital Pass Modal
  const openGuestPass = (booking) => {
    const target = booking || reservations.find(r => r.status === 'checked-in') || reservations[0];
    setGuestPassBooking(target);
    setIsGuestPassOpen(true);
  };

  // Run Automated Midnight Night Audit & Reconcile Day Ledger
  const runNightAudit = (auditNotes = 'Official midnight tariff roll & folio reconciliation completed.') => {
    const timestamp = new Date().toISOString();
    const auditId = `AUDIT-${Date.now().toString().slice(-6)}`;
    const staffName = currentUser ? `${currentUser.name} (${currentUser.designation})` : 'Vikram Rathore (GM)';

    const occupiedRooms = rooms.filter(r => r.status === 'occupied');
    let postedTariffTotal = 0;
    occupiedRooms.forEach(rm => {
      postedTariffTotal += rm.price;
    });

    const summary = {
      auditId,
      timestamp,
      date: '2026-10-24',
      auditor: staffName,
      totalRooms: rooms.length,
      occupiedRoomsCount: occupiedRooms.length,
      occupancyRate: Math.round((occupiedRooms.length / rooms.length) * 100),
      totalGrossRevenue: bills.reduce((sum, b) => sum + b.total, 0),
      settledRevenue: bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0),
      pendingReceivables: bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.total, 0),
      gstCollected: bills.reduce((sum, b) => sum + b.taxes, 0),
      postedRoomsCount: occupiedRooms.length,
      postedTariffTotal,
      notes: auditNotes,
      status: 'Certified & Sealed'
    };

    setLastNightAudit(summary);
    try {
      localStorage.setItem('rajvilas_night_audit', JSON.stringify(summary));
    } catch (e) {}

    addLog(`Night Audit #${auditId} certified by ${staffName}. Occupancy: ${summary.occupancyRate}%, Daily Tariff Posted: ₹${postedTariffTotal.toLocaleString('en-IN')}`, 'Executive');
    return summary;
  };

  // Adjust Inventory
  const adjustInventory = (itemId, delta) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
    api.adjustInventory(itemId, delta).catch(() => {});
  };

  // Add Log
  const addLog = (message, category = 'General') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const authorStr = currentUser ? `${currentUser.name} (${currentUser.designation})` : 'System Dispatch';

    setLogs(prev => [
      { id: Date.now(), author: authorStr, time: timeStr, category, message },
      ...prev
    ]);
  };

  // Calculate high-level KPIs in INR
  const kpis = useMemo(() => {
    const totalRooms = rooms.length;
    const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
    const availableCount = rooms.filter(r => r.status === 'available').length;
    const cleaningCount = rooms.filter(r => r.status === 'cleaning').length;
    const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;
    
    // Revenue calculations in INR
    const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0);
    const pendingRevenue = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.total, 0);

    // Hospitality Metrics: ADR & RevPAR
    const totalRoomPriceOccupied = rooms.filter(r => r.status === 'occupied').reduce((sum, r) => sum + r.price, 0);
    const adr = occupiedCount > 0 ? Math.round(totalRoomPriceOccupied / occupiedCount) : 0;
    const revpar = Math.round((adr * occupancyRate) / 100);

    const lowStockCount = inventory.filter(i => i.quantity <= i.min).length;

    return {
      totalRooms,
      occupiedCount,
      availableCount,
      cleaningCount,
      maintenanceCount,
      occupancyRate,
      totalRevenue,
      pendingRevenue,
      adr,
      revpar,
      lowStockCount
    };
  }, [rooms, bills, inventory]);

  return (
    <HotelContext.Provider value={{
      currentUser,
      currentRole,
      isDbConnected,
      login,
      logout,
      activeTab,
      setActiveTab,
      rooms,
      updateRoomStatus,
      completeInspectionAndClean,
      reservations,
      addReservation,
      updateReservationStatus,
      cancelReservation,
      settleAndCheckout,
      openFolioForBooking,
      verifyGuestId,
      bills,
      toggleBillStatus,
      addExtraChargeToFolio,
      selectedBillToView,
      setSelectedBillToView,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      inventory,
      adjustInventory,
      logs,
      addLog,
      resetFactoryData,
      searchQuery,
      setSearchQuery,
      selectedBooking,
      setSelectedBooking,
      selectedRoom,
      setSelectedRoom,
      isNewBookingOpen,
      setIsNewBookingOpen,
      prefilledRoom,
      setPrefilledRoom,
      prefilledDate,
      setPrefilledDate,
      experiences,
      experienceBookings,
      bookExperience,
      isGuestPassOpen,
      setIsGuestPassOpen,
      guestPassBooking,
      setGuestPassBooking,
      openGuestPass,
      isNightAuditOpen,
      setIsNightAuditOpen,
      lastNightAudit,
      runNightAudit,
      kpis,
      formatINR,
      formatINRCurrency,
      POPULAR_EXTRA_CHARGES
    }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => useContext(HotelContext);
