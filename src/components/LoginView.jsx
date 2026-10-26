import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Hotel, 
  Lock, 
  User, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Crown, 
  Users, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { STAFF_ACCOUNTS } from '../data/mockData';

export const LoginView = () => {
  const { login } = useHotel();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      if (!res.success) {
        setErrorMessage(res.message);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleQuickDemoLogin = (account) => {
    setUsername(account.username);
    setPassword(account.password);
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      login(account.username, account.password);
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-600/15 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0f1422]/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-amber-500/20 border border-amber-400/40 mb-3">
            <Hotel className="w-7 h-7 text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-serif tracking-wide text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
              RAJVILAS
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Heritage Palace & Resort
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans tracking-wide">
            Internal Operations & Staff Management Terminal
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Staff Username / ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin, reception, housekeeping"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Terminal'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Staff Access
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Select Role</span>
          </div>

          <div className="space-y-2">
            {STAFF_ACCOUNTS.map((acc) => {
              const isSelected = username === acc.username;
              return (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-amber-400 font-mono">
                      {acc.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>{acc.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider bg-slate-800 text-amber-400 border border-slate-700">
                          {acc.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {acc.designation} • <span className="font-mono text-slate-500">{acc.username} / {acc.password}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                    Login →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <footer className="mt-6 text-center text-[11px] text-slate-500">
        Rajvilas Heritage Palace & Resort Operations Management • GSTIN: 08AAACL7891F1Z2 • Udaipur, Rajasthan
      </footer>

    </div>
  );
};
