"use client";

import { useState } from "react";
import {
  History,
  Search,
  Download,
  Filter,
  Calendar as CalendarIcon,
  Loader2,
  ShieldCheck,
  Database,
  ExternalLink,
  RefreshCcw,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// ✅ Hooks & Components
import { useAdminAudit } from "@/hooks/admin/use-admin-audit";
import AuditActionBadge from "@/components/admin/audit/AuditActionBadge";
import AuditEntityBadge from "@/components/admin/audit/AuditEntityBadge";

type TabAction =
  | "ALL"
  | "BRAND_CREATE"
  | "BRAND_UPDATE"
  | "PRODUCT_CREATE"
  | "PRODUCT_UPDATE"
  | "SERIAL_UPLOAD"
  | "RULE_CHANGE"
  | "CLAIM_STATUS_CHANGE"
  | "RETAILER_ADD"
  | "USER_INVITE"
  | "SYSTEM_CONFIG_CHANGE"; // Added here

type EntityType =
  | "ALL"
  | "BRAND"
  | "PRODUCT"
  | "SERIAL"
  | "RETAILER"
  | "CLAIM"
  | "WARRANTY_RULE"
  | "GLOBAL_CONFIG"
  | "USER";

export default function AuditLogPage() {
  const { logs, loading, refresh, exportToCSV } = useAdminAudit();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAction, setActiveAction] = useState<string>("ALL");
  const [activeEntity, setActiveEntity] = useState<string>("ALL");

  // 🔍 Multi-Layer Filtering
  const filteredLogs = logs.filter((log) => {
    const matchesAction = activeAction === "ALL" || log.action === activeAction;
    const matchesEntity = activeEntity === "ALL" || log.entity === activeEntity;
    const matchesSearch =
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAction && matchesEntity && matchesSearch;
  });

  const actions = [
    "ALL",
    "BRAND_CREATE",
    "BRAND_UPDATE",
    "PRODUCT_CREATE",
    "PRODUCT_UPDATE",
    "SERIAL_UPLOAD",
    "RULE_CHANGE",
    "CLAIM_STATUS_CHANGE",
    "RETAILER_ADD",
    "USER_INVITE",
    "SYSTEM_CONFIG_CHANGE", // Added here
  ];

  const entities = [
    "ALL",
    "BRAND",
    "PRODUCT",
    "SERIAL",
    "RETAILER",
    "CLAIM",
    "WARRANTY_RULE",
    "GLOBAL_CONFIG",
    "USER",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 space-y-10 pb-32 px-6 md:px-10 pt-10 max-w-400 mx-auto animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200 dark:border-gray-800 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Audit Registry
          </h1>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] opacity-80">
            System Governance & Immutable Action History
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => refresh()}
            className="p-4 bg-slate-100 dark:bg-gray-800 text-slate-500 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:rotate-180 duration-500"
          >
            <RefreshCcw size={18} />
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Download size={16} strokeWidth={2.5} />
            Export CSV
          </button>
        </div>
      </div>

      {/* --- FILTERS BAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        {/* Search */}
        <div className="lg:col-span-2 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Admin, Entity or Details..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:ring-4 ring-blue-600/10 focus:border-blue-600 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Dropdown */}
        <div className="relative group">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors"
            size={16}
          />
          <select
            value={activeAction}
            onChange={(e) => setActiveAction(e.target.value)}
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest appearance-none outline-none focus:ring-4 ring-blue-600/10 focus:border-blue-600 cursor-pointer transition-all"
          >
            <option value="ALL">ALL ACTIONS</option>
            {actions
              .filter((a) => a !== "ALL")
              .map((action) => (
                <option key={action} value={action}>
                  {action.replace(/_/g, " ")}
                </option>
              ))}
          </select>
        </div>

        {/* Entity Dropdown */}
        <div className="relative group">
          <Database
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors"
            size={16}
          />
          <select
            value={activeEntity}
            onChange={(e) => setActiveEntity(e.target.value)}
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest appearance-none outline-none focus:ring-4 ring-blue-600/10 focus:border-blue-600 cursor-pointer transition-all"
          >
            <option value="ALL">ALL ENTITIES</option>
            {entities
              .filter((e) => e !== "ALL")
              .map((entity) => (
                <option key={entity} value={entity}>
                  {entity.replace(/_/g, " ")}
                </option>
              ))}
          </select>
        </div>

        {/* Date Placeholder */}
        <div className="relative">
          <CalendarIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 text-xs font-bold text-slate-800 dark:text-slate-200 opacity-60 cursor-not-allowed"
            disabled
          />
        </div>
      </div>

      {/* --- LOGS TABLE --- */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2
              className="animate-spin text-blue-600"
              size={36}
              strokeWidth={2.5}
            />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
              Deciphering Logs...
            </p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-center">
            <History
              className="text-slate-200 dark:text-slate-800"
              size={64}
              strokeWidth={1.5}
            />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 opacity-70">
              No matching audit records
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Timestamp
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Admin
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Action
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Entity Scope
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    Details
                  </th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                    TX Hash
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          {format(new Date(log.createdAt), "dd MMM yyyy")}
                        </span>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-0.5 uppercase tracking-wider opacity-70">
                          {format(new Date(log.createdAt), "HH:mm:ss")}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                          <ShieldCheck size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate max-w-30">
                          {log.adminName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <AuditActionBadge action={log.action} />
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <AuditEntityBadge entity={log.entity} />
                        {log.entityName && (
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate max-w-25">
                            ID: {log.entityName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-6 max-w-xs">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-relaxed line-clamp-2 opacity-80 pr-4">
                        {log.details}
                      </p>
                    </td>

                    <td className="px-8 py-6 text-right font-mono">
                      {log.txHash ? (
                        <a
                          href={`https://polygonscan.com/tx/${log.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center justify-end gap-1.5 uppercase transition-all"
                        >
                          {log.txHash.slice(0, 6)}...{log.txHash.slice(-4)}
                          <ExternalLink size={12} strokeWidth={2.5} />
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 font-bold">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
