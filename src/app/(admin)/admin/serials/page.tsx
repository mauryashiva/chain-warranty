"use client";

import { useAdminSerials } from "@/hooks/admin/use-admin-serials";
import {
  Hash,
  Upload,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Total Serials", value: "9.2k", icon: Hash },
  {
    label: "Registered",
    value: "1.3k",
    icon: ShieldCheck,
    color: "text-emerald-600",
  },
  {
    label: "Unregistered",
    value: "7.9k",
    icon: AlertCircle,
    color: "text-slate-400",
  },
  { label: "Flagged", value: "12", icon: AlertCircle, color: "text-rose-600" },
];

export default function AdminSerialsPage() {
  const { validateSerial, isValidating } = useAdminSerials();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Serial Numbers
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400 mt-1">
            Validate and manage authorized serial numbers per product.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-gray-800 text-xs font-black rounded-xl">
            <Upload size={16} /> BULK UPLOAD CSV
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs shadow-lg shadow-blue-600/20">
            + ADD SINGLE
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800"
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon size={20} className="text-slate-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
            <p
              className={cn(
                "text-2xl font-black mt-1",
                stat.color || "text-slate-900 dark:text-white",
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Validator Search (Industry Standard) */}
      <div className="p-8 rounded-3xl bg-slate-950 text-white space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Validate a Serial Number
        </label>
        <div className="flex gap-4">
          <input
            placeholder="Enter serial number to validate... e.g. SN-2024-48291"
            className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-blue-500"
          />
          <button className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-500 hover:text-white transition-all">
            VALIDATE
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-gray-800/30">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-gray-800">
              <th className="px-6 py-4">Serial Number</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Batch</th>
              <th className="px-6 py-4">Mfg Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Registered By</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {[1, 2, 3].map((i) => (
              <tr
                key={i}
                className="hover:bg-slate-50/50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-[11px] font-black text-slate-950 dark:text-white">
                  SN-2023-48291
                </td>
                <td className="px-6 py-4 text-xs font-bold">Sony WH-1000XM5</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400">
                  LOT-23-Q1
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400">
                  Jan 2023
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-[9px] font-black uppercase">
                    Registered
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-[10px] font-bold text-blue-600">
                  0x114D...66ed
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                    <Eye size={16} className="text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
