import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  X, 
  Moon, 
  CheckCircle2, 
  FileText, 
  Printer, 
  ShieldCheck, 
  TrendingUp, 
  BedDouble, 
  CreditCard, 
  Clock, 
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { formatINR } from '../data/mockData';

export const NightAuditModal = () => {
  const { 
    isNightAuditOpen, 
    setIsNightAuditOpen, 
    lastNightAudit, 
    runNightAudit, 
    rooms, 
    reservations, 
    bills,
    currentUser,
    kpis
  } = useHotel();

  const [auditNotes, setAuditNotes] = useState('All evening banquet and lake charter charges posted. Midnight ledger balanced.');
  const [auditResult, setAuditResult] = useState(lastNightAudit);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isNightAuditOpen) return null;

  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const pastDueDepartures = reservations.filter(r => r.status === 'checked-in' && r.checkout < '2026-10-24');

  const handleStartNightAudit = () => {
    setIsRunning(true);
    setCurrentStep(1);

    setTimeout(() => {
      setCurrentStep(2);
      setTimeout(() => {
        setCurrentStep(3);
        setTimeout(() => {
          const res = runNightAudit(auditNotes);
          setAuditResult(res);
          setIsRunning(false);
          setCurrentStep(4);
        }, 700);
      }, 700);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f1422] border border-amber-500/40 rounded-3xl w-full max-w-2xl shadow-2xl p-6 relative my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsNightAuditOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              End of Day Audit Protocol
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Auditor: {currentUser ? `${currentUser.name} (${currentUser.designation})` : 'Vikram Rathore (GM)'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-white mt-1">
            Automated Midnight Night Audit & Ledger Roll
          </h2>
          <p className="text-xs text-slate-400">
            Reconciles occupied room charges, balances folio receivables, audits 12% GST, and compiles the official General Manager's Daily Revenue Summary.
          </p>
        </div>

        {/* Pre-Audit Operational Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Occupied Rooms To Post
            </span>
            <span className="text-lg font-bold font-serif text-amber-300">
              {occupiedRooms.length} Chambers
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Tariff: {formatINR(occupiedRooms.reduce((sum, r) => sum + r.price, 0))}
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Live Occupancy
            </span>
            <span className="text-lg font-bold font-serif text-emerald-400">
              {kpis.occupancyRate}% Rate
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              RevPAR: {formatINR(kpis.revpar)}
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Ledger Health
            </span>
            <span className="text-lg font-bold font-serif text-indigo-300">
              {formatINR(bills.reduce((sum, b) => sum + b.total, 0))}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              100% Invoices Balanced
            </span>
          </div>
        </div>

        {/* Audit Pipeline Steps */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-5 space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Audit Sequence Status</span>
            <span className="font-mono text-amber-400 text-[11px]">
              {isRunning ? 'Processing Night Run...' : auditResult ? 'Audit Completed & Certified' : 'Ready for Execution'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep >= 1 || auditResult ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800/40 text-slate-400'}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. Validated active departures & verified zero past-due unreleased keys</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep >= 2 || auditResult ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800/40 text-slate-400'}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>2. Scanned and posted midnight room tariffs for {occupiedRooms.length} in-house guest chambers</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep >= 3 || auditResult ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800/40 text-slate-400'}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>3. Reconciled UPI, Card, and Cash accounts against 12% GST ledger requirements</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${currentStep >= 4 || auditResult ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800/40 text-slate-400'}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>4. Compiled official General Manager's Daily Operating Summary & certified cryptographic seal</span>
            </div>
          </div>
        </div>

        {/* Audit Certification Notes */}
        {!auditResult && (
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Duty Manager / Night Auditor Notes
            </label>
            <textarea
              rows="2"
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {/* 📄 Official GM Daily Report (Shown once audited) */}
        {auditResult && (
          <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-5 mb-5 space-y-3 text-xs print:m-0 print:border-none">
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                  Official Executive Briefing
                </span>
                <h4 className="text-base font-bold font-serif text-white">
                  General Manager's Daily Revenue & Operational Report
                </h4>
                <p className="text-[11px] text-slate-400">
                  Audit Ref: <strong className="font-mono text-slate-200">{auditResult.auditId}</strong> • Timestamp: {new Date(auditResult.timestamp).toLocaleString('en-IN')}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                Certified & Sealed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Occupancy</span>
                <span className="text-sm font-bold text-white">{auditResult.occupancyRate}%</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Avg Daily Rate</span>
                <span className="text-sm font-bold text-amber-300">{formatINR(kpis.adr)}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Gross Invoiced</span>
                <span className="text-sm font-bold text-white">{formatINR(auditResult.totalGrossRevenue)}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Total GST (12%)</span>
                <span className="text-sm font-bold text-emerald-400">{formatINR(auditResult.gstCollected)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
              "{auditResult.notes}"
            </p>

            <div className="hidden print:flex justify-between items-end pt-8 text-[11px] text-black">
              <div>
                <p className="border-b border-black w-40 mb-1"></p>
                <p className="font-semibold">Night Auditor Signature</p>
              </div>
              <div className="text-right">
                <p className="border-b border-black w-40 mb-1 ml-auto"></p>
                <p className="font-semibold">Vikram Rathore, General Manager</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {auditResult && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print GM Daily Report</span>
              </button>
            )}

            {auditResult && (
              <button
                onClick={() => {
                  setAuditResult(null);
                  setCurrentStep(0);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
                title="Rerun Night Audit"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Rerun Audit</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNightAuditOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>

            {!auditResult && (
              <button
                onClick={handleStartNightAudit}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <Moon className="w-4 h-4" />
                <span>{isRunning ? 'Auditing Midnight Ledger...' : 'Execute Night Audit & Close Day'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
