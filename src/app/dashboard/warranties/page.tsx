"use client";

import { useWarranties } from "@/hooks/use-warranties";
import WarrantyTable from "@/components/warranty/WarrantyTable";
import { Plus, RefreshCcw, Search } from "lucide-react";

export default function WarrantiesPage() {
  const { data, loading, error, refresh } = useWarranties();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white">
            My Warranties
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-neutral-400">
            You currently have {data.length} assets secured on-chain.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="p-3 rounded-xl border-2 border-gray-100 hover:bg-white transition-all dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95">
            <Plus size={20} strokeWidth={3} />
            REGISTER NEW
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-md group">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
        />
        <input
          placeholder="Filter by product name or token ID..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-sm font-bold outline-none focus:border-blue-600 transition-all dark:bg-black dark:border-neutral-900"
        />
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="h-64 flex items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-neutral-800">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Loading Ledger...
            </p>
          </div>
        </div>
      ) : (
        <WarrantyTable warranties={data} />
      )}
    </div>
  );
}
