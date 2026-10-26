import React, { useState, useMemo, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Printer, 
  X,
  Sparkles,
  Plus,
  Download,
  UtensilsCrossed,
  Receipt,
  FileSpreadsheet,
  QrCode
} from 'lucide-react';
import { formatINR, formatINRCurrency } from '../data/mockData';
import { UPIPaymentModal } from './UPIPaymentModal';

export const BillingFolio = () => {
  const { 
    bills, 
    toggleBillStatus, 
    addExtraChargeToFolio, 
    POPULAR_EXTRA_CHARGES,
    searchQuery,
    selectedBillToView,
    setSelectedBillToView
  } = useHotel();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewingBill, setViewingBill] = useState(null);
  const [chargeModalBill, setChargeModalBill] = useState(null);
  const [upiModalBill, setUpiModalBill] = useState(null);

  // Auto-open bill when navigated from Booking Details
  useEffect(() => {
    if (selectedBillToView) {
      setViewingBill(selectedBillToView);
      setSelectedBillToView(null);
    }
  }, [selectedBillToView, setSelectedBillToView]);

  // Quick Charge Form State
  const [selectedPreset, setSelectedPreset] = useState(POPULAR_EXTRA_CHARGES[0]);
  const [customDescription, setCustomDescription] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const activeSearch = search || searchQuery;

  const filteredBills = useMemo(() => {
    return bills.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (activeSearch) {
        const q = activeSearch.toLowerCase();
        const matchGuest = b.guest.toLowerCase().includes(q);
        const matchRoom = b.room.toString().includes(q);
        const matchId = b.id.toString().includes(q);
        if (!matchGuest && !matchRoom && !matchId) return false;
      }
      return true;
    });
  }, [bills, statusFilter, activeSearch]);

  const totalBilled = bills.reduce((sum, b) => sum + b.total, 0);
  const paidTotal = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0);
  const pendingTotal = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.total, 0);

  // Submit Extra Dining/Incidentals Charge
  const handlePostChargeSubmit = (e) => {
    e.preventDefault();
    if (!chargeModalBill) return;

    const desc = isCustom ? customDescription.trim() : selectedPreset.name;
    const amount = isCustom ? parseFloat(customAmount) : selectedPreset.price;

    if (!desc || isNaN(amount) || amount <= 0) return;

    addExtraChargeToFolio(chargeModalBill.id, desc, amount);

    // If currently viewing this bill in details modal, update viewingBill instance
    if (viewingBill && viewingBill.id === chargeModalBill.id) {
      const updated = bills.find(b => b.id === chargeModalBill.id);
      if (updated) setViewingBill(updated);
    }

    setChargeModalBill(null);
    setCustomDescription('');
    setCustomAmount('');
    setIsCustom(false);
  };

  // Export GST GSTR-1 CSV Report for Accounting
  const handleExportGSTR1 = () => {
    const headers = [
      'Invoice / Folio #',
      'Guest Name',
      'Room Assigned',
      'Room Charges (INR)',
      'Incidentals & Dining (INR)',
      'Taxable Value (INR)',
      'Central GST 6% (INR)',
      'State GST 6% (INR)',
      'Total GST 12% (INR)',
      'Grand Total Invoiced (INR)',
      'Settlement Mode',
      'Payment Status',
      'Invoice Date'
    ];

    const rows = bills.map(b => [
      b.id,
      `"${b.guest}"`,
      b.room,
      b.roomCharges,
      b.extraCharges,
      b.roomCharges + b.extraCharges,
      b.taxes / 2,
      b.taxes / 2,
      b.taxes,
      b.total,
      `"${b.paymentMethod}"`,
      b.status.toUpperCase(),
      b.date
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rajvilas_GSTR1_Tax_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Cards in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Settled */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled & Collected</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-serif">
            {formatINR(paidTotal)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {bills.filter(b => b.status === 'paid').length} accounts fully cleared
          </p>
        </div>

        {/* Pending Receivables */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Receivables</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 mt-2 font-serif">
            {formatINR(pendingTotal)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {bills.filter(b => b.status === 'pending').length} folios awaiting settlement
          </p>
        </div>

        {/* Total Billed */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Invoiced (With GST)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            {formatINR(totalBilled)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Across {bills.length} itemized guest folios
          </p>
        </div>
      </div>

      {/* Folios Action & Filter Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            GST Tax Invoices & Guest Billing Folios
          </h2>
          <p className="text-xs text-slate-400">
            Real-time ledger with In-Room Dining charge posting, 12% GST (CGST + SGST), and GSTR-1 export
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
              placeholder="Search guest, room or folio #..."
              className="bg-slate-900 border border-slate-700/70 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 w-full md:w-56 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/60"
          >
            <option value="all">All Folios ({bills.length})</option>
            <option value="paid">Paid & Settled</option>
            <option value="pending">Pending Settlement</option>
          </select>

          {/* GSTR-1 Export Button */}
          <button
            onClick={handleExportGSTR1}
            title="Download Official GSTR-1 GST Report (CSV)"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export GSTR-1 CSV</span>
          </button>
        </div>
      </div>

      {/* Folio Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Folio #</th>
                <th className="py-3.5 px-4">Guest</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Room Tariff</th>
                <th className="py-3.5 px-4">Dining & Extras</th>
                <th className="py-3.5 px-4">GST (12%)</th>
                <th className="py-3.5 px-4">Grand Total</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-500">
                    No billing folios found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => {
                  const isPaid = bill.status === 'paid';
                  return (
                    <tr key={bill.id} className="hover:bg-slate-800/40 transition">
                      
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        #{bill.id}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {bill.guest}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                          Room {bill.room}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {formatINR(bill.roomCharges)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {formatINR(bill.extraCharges)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {formatINR(bill.taxes)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                        {formatINR(bill.total)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {bill.paymentMethod}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          isPaid 
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isPaid ? 'Settled' : 'Pending'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* UPI Pay QR button */}
                          {!isPaid && (
                            <button
                              onClick={() => setUpiModalBill(bill)}
                              title="Collect Instant Payment via Indian UPI QR (GPay / PhonePe / Paytm)"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <QrCode className="w-3 h-3" />
                              <span>UPI QR</span>
                            </button>
                          )}

                          {/* Post Dining / Extra charge button */}
                          <button
                            onClick={() => setChargeModalBill(bill)}
                            title="Add In-Room Dining or Concierge Charge to Folio"
                            className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                          >
                            <UtensilsCrossed className="w-3 h-3" />
                            <span>+ Charge</span>
                          </button>

                          {/* Toggle status */}
                          <button
                            onClick={() => toggleBillStatus(bill.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                              isPaid 
                                ? 'bg-slate-800 text-slate-400 hover:text-rose-300 hover:bg-slate-700' 
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                            }`}
                          >
                            {isPaid ? 'Mark Pending' : 'Mark Settled'}
                          </button>

                          {/* View Folio */}
                          <button
                            onClick={() => setViewingBill(bill)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                            title="View GST Tax Invoice Folio"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Dining / Incidentals Charge Modal */}
      {chargeModalBill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            
            <button
              onClick={() => setChargeModalBill(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20 uppercase tracking-widest font-bold">
                Room Service & Incidentals Ledger
              </span>
              <h3 className="text-lg font-bold font-serif text-white mt-1">
                Post Charge to Room {chargeModalBill.room}
              </h3>
              <p className="text-xs text-slate-400">
                Guest: <strong className="text-slate-200">{chargeModalBill.guest}</strong> • Folio #{chargeModalBill.id}
              </p>
            </div>

            <form onSubmit={handlePostChargeSubmit} className="space-y-4 text-xs">
              
              {/* Preset selection tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Palace Amenity / Menu Item:
                </label>
                
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {POPULAR_EXTRA_CHARGES.map(item => {
                    const isSelected = !isCustom && selectedPreset.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(item);
                          setIsCustom(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-sm'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-[11px] leading-tight truncate">{item.name}</div>
                        <div className="text-[10px] text-amber-400/90 font-mono mt-1 font-bold">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Or Custom Charge Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isCustom ? 'Use Preset Menu Item' : 'Or Enter Custom Charge'}</span>
                </button>

                {isCustom && (
                  <div className="mt-3 space-y-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Charge Description
                      </label>
                      <input
                        type="text"
                        required={isCustom}
                        placeholder="e.g. Vintage Car Lake Tour or Dry Cleaning"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Amount (₹ INR Before GST)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required={isCustom}
                        placeholder="e.g. 1500"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setChargeModalBill(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Post Charge to Room
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Official GST Folio Invoice Modal */}
      {viewingBill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setViewingBill(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20 uppercase tracking-widest">
                  GST Tax Invoice Folio
                </span>
                <span className="text-xs font-mono text-slate-400">#{viewingBill.id}</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-white mt-1">RAJVILAS HERITAGE PALACE & RESORT</h3>
              <p className="text-[11px] text-slate-400">Lake Pichola Road, Udaipur, Rajasthan 313001 • GSTIN: 08AAACL7891F1Z2</p>
            </div>

            {/* Bill Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Guest Name</span>
                <span className="font-semibold text-white">{viewingBill.guest}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Room</span>
                <span className="font-semibold text-amber-400">Room {viewingBill.room}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Payment Method</span>
                <span className="font-medium text-slate-300">{viewingBill.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Settlement Status</span>
                <span className={`font-semibold capitalize ${viewingBill.status === 'paid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {viewingBill.status}
                </span>
              </div>
            </div>

            {/* Itemized charges with CGST & SGST */}
            <div className="space-y-3 text-xs border-b border-slate-800 pb-4 mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Itemized Account Ledger ({viewingBill.items ? viewingBill.items.length : 1} items)
              </span>

              <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                {viewingBill.items && viewingBill.items.length > 0 ? (
                  viewingBill.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-slate-300 text-xs border-b border-slate-800/60 last:border-0">
                      <div>
                        <span className="block font-medium text-slate-200">{item.description}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                      </div>
                      <span className="font-mono text-slate-200">{formatINR(item.amount)}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between py-1 text-slate-300">
                    <span>Room Charges (Stay duration)</span>
                    <span className="font-mono">{formatINR(viewingBill.roomCharges)}</span>
                  </div>
                )}
              </div>

              {/* Tax calculations */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Central GST (CGST @ 6%)</span>
                  <span className="font-mono">{formatINR(viewingBill.taxes / 2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>State GST (SGST @ 6%)</span>
                  <span className="font-mono">{formatINR(viewingBill.taxes / 2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                  <span>Grand Total Invoiced</span>
                  <span className="font-mono text-amber-400">{formatINR(viewingBill.total)}</span>
                </div>
              </div>
            </div>

            {/* Palace Print Signatures (Shown only on Print) */}
            <div className="hidden print:flex justify-between items-end pt-8 text-xs border-t border-slate-300 mt-4 mb-4">
              <div>
                <p className="border-b border-black w-48 mb-1"></p>
                <p className="font-semibold text-black">Guest Signature</p>
                <p className="text-[10px] text-gray-600">I accept liability for all hotel & dining charges incurred.</p>
              </div>
              <div className="text-right">
                <p className="border-b border-black w-48 mb-1 ml-auto"></p>
                <p className="font-semibold text-black">Duty Manager / Cashier</p>
                <p className="text-[10px] text-gray-600">Rajvilas Heritage Palace & Resort • Udaipur</p>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print GST Folio</span>
                </button>

                <button
                  onClick={() => {
                    setChargeModalBill(viewingBill);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Extra Charge</span>
                </button>

                {viewingBill.status === 'pending' && (
                  <button
                    onClick={() => setUpiModalBill(viewingBill)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Pay via UPI QR</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setViewingBill(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow-md transition cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Indian UPI QR Modal */}
      <UPIPaymentModal
        isOpen={Boolean(upiModalBill)}
        onClose={() => setUpiModalBill(null)}
        bill={upiModalBill}
      />

    </div>
  );
};
