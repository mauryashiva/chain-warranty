"use client";

import { useAdminAudit } from "@/hooks/admin/use-admin-audit";
import {
  History,
  Search,
  Filter,
  Download,
  User,
  Database,
  Link2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminAuditLogPage() {
  const { logs, loading } = useAdminAudit();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Audit Log
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
            Every admin action recorded with timestamp and wallet ID.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <div className="p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            placeholder="Search actions, users, or entities..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl text-xs font-bold outline-none"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl text-[10px] font-black text-slate-400 uppercase">
          <Clock size={14} /> mm / dd / yyyy
        </div>
        <select className="bg-slate-50 dark:bg-gray-800/50 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border-none">
          <option>All Actions</option>
          <option>Brand added</option>
          <option>Product created</option>
          <option>Claim resolved</option>
        </select>
      </div>

      {/* The Master Log Table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50/50 dark:bg-gray-800/30 border-b border-slate-100 dark:border-gray-800">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Admin</th>
                <th className="px-8 py-5">Action</th>
                <th className="px-8 py-5">Entity</th>
                <th className="px-8 py-5">Details</th>
                <th className="px-8 py-5 text-right">TX Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-20 text-center text-xs font-bold text-slate-400"
                  >
                    Syncing with Audit Database...
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center text-[10px] font-black">
                          {log.admin.name[0]}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {log.admin.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-blue-600 text-[10px] font-bold">
                        <Database size={12} /> {log.entity}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400 truncate max-w-[200px]">
                      {log.details || "—"}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {log.txHash ? (
                        <code className="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
                          {log.txHash.slice(0, 6)}...
                        </code>
                      ) : (
                        <span className="text-slate-300 dark:text-gray-700">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
