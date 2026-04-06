"use client";

import { useAdminClaims } from "@/hooks/admin/use-admin-claims";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  User,
  Smartphone,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: any = {
  PENDING: {
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    icon: Clock,
  },
  APPROVED: {
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    icon: CheckCircle2,
  },
  REJECTED: {
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    icon: XCircle,
  },
  IN_PROGRESS: {
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: ShieldAlert,
  },
};

export default function AdminClaimsPage() {
  const { claims, loading } = useAdminClaims();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Claims Management
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
            Review, approve and resolve all warranty repair requests.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-1 rounded-xl shadow-sm">
            {["All", "Open", "Resolved"].map((tab) => (
              <button
                key={tab}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-all"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-gray-800 flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search by Claim ID or Wallet..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl text-xs font-bold outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 text-xs font-black text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-xl transition-all">
            <Filter size={16} /> FILTER
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-gray-800/30">
                <th className="px-8 py-5">Claim ID</th>
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Issue</th>
                <th className="px-8 py-5">Owner Wallet</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {claims.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-12 text-center text-xs font-bold text-slate-400"
                  >
                    No active claims found.
                  </td>
                </tr>
              ) : (
                claims.map((claim: any) => {
                  const StatusIcon = STATUS_CONFIG[claim.status].icon;
                  return (
                    <tr
                      key={claim.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-8 py-6 text-xs font-black text-slate-900 dark:text-white">
                        #{claim.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <Smartphone size={16} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                            {claim.warranty.product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500 max-w-50 truncate">
                        {claim.reason}
                      </td>
                      <td className="px-8 py-6 font-mono text-[10px] text-blue-600">
                        {claim.user.wallets[0]?.address.slice(0, 10)}...
                      </td>
                      <td className="px-8 py-6">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                            STATUS_CONFIG[claim.status].bg,
                            STATUS_CONFIG[claim.status].color,
                          )}
                        >
                          <StatusIcon size={12} />
                          {claim.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 bg-slate-100 dark:bg-gray-800 rounded-lg text-slate-500 hover:text-blue-600 transition-all">
                            <ExternalLink size={14} />
                          </button>
                          <button className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase rounded-lg hover:scale-105 transition-all">
                            Review
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
    </div>
  );
}
