"use client";

import { cn } from "@/lib/utils";
import {
  User,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import { format } from "date-fns";
import ClaimStatusBadge from "./ClaimStatusBadge";

interface ClaimsTableProps {
  claims: any[];
  onReview: (claim: any) => void;
}

export default function ClaimsTable({ claims, onReview }: ClaimsTableProps) {
  if (!claims || claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-[3rem] animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-50 dark:bg-gray-900 rounded-4xl flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 shadow-inner">
          <Inbox size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
          Registry Vacant
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest opacity-80">
          No active claims detected in the protocol
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-250">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Protocol ID
              </th>
              <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Asset & Context
              </th>
              <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Integrity Risk
              </th>
              <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Current Status
              </th>
              <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Analyst
              </th>
              <th className="px-10 py-7 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Execution
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-gray-900">
            {claims.map((claim) => (
              <tr
                key={claim.id}
                className="hover:bg-slate-50/80 dark:hover:bg-gray-900/40 transition-all duration-300 group"
              >
                {/* 1. Protocol ID & Temporal Data */}
                <td className="px-10 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {claim.claimNumber}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter tabular-nums">
                      Initiated{" "}
                      {format(new Date(claim.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                </td>

                {/* 2. Asset Identity */}
                <td className="px-6 py-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                      {claim.product?.name || "Generic Asset"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 line-clamp-1 max-w-50 opacity-90">
                      {claim.subject}
                    </span>
                  </div>
                </td>

                {/* 3. Fraud Risk Assessment */}
                <td className="px-6 py-6">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all duration-500",
                      claim.fraudScore > 70
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                    )}
                  >
                    {claim.fraudScore > 70 ? (
                      <AlertTriangle size={10} className="animate-pulse" />
                    ) : (
                      <CheckCircle2 size={10} />
                    )}
                    <span className="tabular-nums">
                      Score: {claim.fraudScore}%
                    </span>
                  </div>
                </td>

                {/* 4. Modular Lifecycle Status */}
                <td className="px-6 py-6">
                  <ClaimStatusBadge status={claim.status} />
                </td>

                {/* 5. Analyst Assignment */}
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-gray-900 flex items-center justify-center text-slate-400 border border-slate-200/50 dark:border-gray-800 shadow-sm transition-transform group-hover:scale-110">
                      <User size={14} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-200 leading-none">
                        {claim.assignedTo || "Auto-Queue"}
                      </span>
                      {claim.assignedAt && (
                        <span className="text-[8px] font-bold text-slate-400 uppercase mt-1.5 tracking-tighter tabular-nums">
                          Locked {format(new Date(claim.assignedAt), "HH:mm")}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* 6. Protocol Action */}
                <td className="px-10 py-6 text-right">
                  <button
                    onClick={() => onReview(claim)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-95 shadow-lg shadow-slate-900/10 dark:shadow-slate-100/5 group/btn"
                  >
                    Review
                    <ChevronRight
                      size={12}
                      strokeWidth={3}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
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
