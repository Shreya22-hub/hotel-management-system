import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Search, 
  CheckCircle2, 
  RefreshCw, 
  DollarSign, 
  Layers,
  Sparkles,
  Bath,
  Droplets,
  KeyRound,
  Footprints,
  Coffee,
  Wine,
  Wind
} from 'lucide-react';

export const InventoryTracker = () => {
  const { inventory, adjustInventory, addLog } = useHotel();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    const set = new Set(inventory.map(i => i.category));
    return ['all', ...Array.from(set)];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [inventory, selectedCategory, search]);

  const lowStockItems = inventory.filter(i => i.quantity <= i.min);
  const totalStockValue = inventory.reduce((sum, i) => sum + (i.quantity * i.costPerUnit), 0);

  const handleRestock = (item) => {
    const restockQty = item.min * 2;
    adjustInventory(item.id, restockQty);
    addLog(`Restocked +${restockQty} units of ${item.name}`, 'Housekeeping');
  };

  return (
    <div className="space-y-6">
      
      {/* Low Stock Warning Banner if any items low */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                Low Stock Threshold Alert ({lowStockItems.length} items need reorder)
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {lowStockItems.map(i => i.name).slice(0, 3).join(', ')}
                {lowStockItems.length > 3 ? ` and ${lowStockItems.length - 3} others` : ''} are below minimum operating limits.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              lowStockItems.forEach(handleRestock);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition cursor-pointer shrink-0"
          >
            Auto-Replenish All Low
          </button>
        </div>
      )}

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total SKUs */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracked Supplies</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-serif">
            {inventory.length} SKUs
          </div>
          <p className="text-xs text-slate-400 mt-1">Across 7 hotel supply categories</p>
        </div>

        {/* Low Stock Alert Count */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Reorders</span>
            <div className={`p-2 rounded-xl border ${lowStockItems.length > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-extrabold mt-2 font-serif ${lowStockItems.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockItems.length} Items
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lowStockItems.length > 0 ? 'Immediate supplier PO suggested' : 'All supply levels healthy'}
          </p>
        </div>

        {/* Total Stock Valuation */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inventory Value</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2 font-serif">
            ₹{Math.round(totalStockValue).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">At wholesale replacement cost</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            Housekeeping Amenities & Stock Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Real-time quantity adjustments, min-threshold alerts, and replenishment orders
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
              placeholder="Search supply item..."
              className="bg-slate-900 border border-slate-700/70 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 w-full md:w-48 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700/70 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/60"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map(item => {
          const isLow = item.quantity <= item.min;
          const ratio = Math.min(100, Math.round((item.quantity / (item.min * 2)) * 100));

          return (
            <div 
              key={item.id}
              className={`bg-[#111726] border rounded-2xl p-4 shadow-lg flex flex-col justify-between transition ${
                isLow 
                  ? 'border-rose-500/50 bg-gradient-to-b from-[#16121e] to-[#111726]' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2 leading-tight">
                      {item.name}
                    </h3>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isLow 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {isLow ? 'Low Stock' : 'Optimal'}
                  </span>
                </div>

                {/* Stock Level Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">
                      Current: <strong className="text-white font-mono text-sm">{item.quantity}</strong> {item.unit}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Min: {item.min} {item.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isLow ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                  <span>Unit Cost: <strong className="text-slate-200 font-mono">₹{item.costPerUnit.toLocaleString('en-IN')}</strong></span>
                  <span>Total Value: <strong className="text-amber-300 font-mono">₹{Math.round(item.quantity * item.costPerUnit).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              {/* Adjust Quantity Controls */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustInventory(item.id, -1)}
                    disabled={item.quantity === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition disabled:opacity-30 cursor-pointer"
                    title="Deduct 1"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustInventory(item.id, 1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                    title="Add 1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustInventory(item.id, 10)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-mono transition cursor-pointer"
                    title="Add 10"
                  >
                    +10
                  </button>
                </div>

                {/* Restock trigger */}
                <button
                  onClick={() => handleRestock(item)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restock</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
