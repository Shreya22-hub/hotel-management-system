import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Smartphone, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '../data/mockData';

export const UPIPaymentModal = ({ bill, onClose, onPaymentSuccess, isOpen }) => {
  const { toggleBillStatus, addLog } = useHotel();
  const [copied, setCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState('Google Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  if (!bill || (isOpen !== undefined && !isOpen)) return null;

  const vpa = 'rajvilas.palace@icici';
  const payeeName = 'Rajvilas Heritage Palace & Resort';
  const amount = bill.total;
  const transactionNote = `Folio #${bill.id} - Room #${bill.room}`;
  
  // Standard NPCI / BHIM Unified Payments Interface Intent URI
  const upiUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&tr=INV${bill.id}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  
  // High-contrast clean QR Code endpoint with offline SVG fallback
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}&bgcolor=ffffff&color=090d16&margin=1`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    
    // Simulate real-time NPCI settlement webhook
    setTimeout(() => {
      const generatedUtr = `UPI/${Math.floor(200000000000 + Math.random() * 800000000000)}`;
      setUtrNumber(generatedUtr);
      setIsProcessing(false);
      setPaymentDone(true);

      // Settle bill
      if (bill.status !== 'paid') {
        toggleBillStatus(bill.id);
      }

      addLog(`Instant UPI Payment of ${formatINR(bill.total)} received for Room ${bill.room} (Folio #${bill.id}) via ${selectedApp}. Reference UTR: ${generatedUtr}`, 'Billing');

      if (onPaymentSuccess) {
        onPaymentSuccess(generatedUtr);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1422] border border-amber-500/40 rounded-3xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden">
        
        {/* Ambient Palace Glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 blur-[80px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!paymentDone ? (
          <div>
            {/* Header */}
            <div className="border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">
                <Smartphone className="w-4 h-4" />
                <span>Instant BHIM UPI Payment</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                Scan to Pay {formatINR(bill.total)}
              </h3>
              <p className="text-xs text-slate-400">
                Guest: <strong className="text-slate-200">{bill.guest}</strong> • Room #{bill.room} (Folio #{bill.id})
              </p>
            </div>

            {/* UPI QR Display Card */}
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-xl my-4 border border-slate-200">
              <img 
                src={qrCodeUrl} 
                alt="UPI Payment QR Code" 
                className="w-48 h-48 rounded-lg object-contain"
                onError={(e) => {
                  // Fallback if network is blocked
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback graphic if offline */}
              <div className="hidden w-48 h-48 bg-slate-100 rounded-xl flex-col items-center justify-center text-slate-800 p-3 text-center border-2 border-dashed border-slate-300">
                <QrCode className="w-16 h-16 text-slate-700 mb-2" />
                <span className="text-xs font-mono font-bold">{vpa}</span>
                <span className="text-[10px] text-slate-500">Scan via any UPI App</span>
              </div>

              {/* UPI Logos & NPCI Badge */}
              <div className="flex items-center justify-center gap-3 pt-3 mt-2 border-t border-slate-200 w-full text-[11px] text-slate-700 font-semibold">
                <span className="text-[#3b82f6]">Google Pay</span>
                <span>•</span>
                <span className="text-[#673ab7]">PhonePe</span>
                <span>•</span>
                <span className="text-[#00baf2]">Paytm</span>
                <span>•</span>
                <span className="text-[#00897b]">BHIM</span>
              </div>
            </div>

            {/* Payment VPA Copy Card */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs mb-4">
              <div>
                <span className="text-slate-500 block text-[10px]">Merchant UPI VPA</span>
                <span className="font-mono text-slate-200 font-bold">{vpa}</span>
              </div>
              <button
                type="button"
                onClick={copyUpiId}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-semibold transition cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* App Selector for Simulation */}
            <div className="space-y-2 mb-5">
              <label className="block text-slate-400 text-xs font-medium">Guest Paying via App:</label>
              <div className="grid grid-cols-4 gap-2">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map(app => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedApp(app)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
                      selectedApp === app
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Awaiting NPCI UPI Confirmation...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm Guest UPI Payment ({formatINR(bill.total)})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                Cancel / Return to Folio
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Payment Settled & Cleared
              </span>
              <h3 className="text-2xl font-bold font-serif text-white mt-2">
                {formatINR(bill.total)} Paid via {selectedApp}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Room #{bill.room} • Guest: {bill.guest}
              </p>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Bank Reference UTR:</span>
                <span className="font-mono text-amber-300 font-bold">{utrNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Settlement Timestamp:</span>
                <span className="font-mono text-slate-200">{new Date().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">SUCCESS (Account Cleared)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
            >
              Done / Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
