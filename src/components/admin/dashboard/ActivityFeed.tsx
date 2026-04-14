"use client";

import { History, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// ✅ Hooks
import { useAdminAudit } from "@/hooks/admin/use-admin-audit";

export default function ActivityFeed() {
  const { logs, loading } = useAdminAudit();

  // We only show the latest 5 activities for the dashboard feed
  const recentLogs = logs.slice(0, 5);

  return (
    <div className="rounded-[2.5rem] bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-8 shadow-sm">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-gray-800 rounded-xl text-slate-600 dark:text-slate-400">
            <History size={18} />
          </div>
          <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Recent Admin Activity
          </h4>
        </div>
        <Link
          href="/admin/audit"
          className="text-[10px] font-black text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors"
        >
          VIEW FULL LOG
        </Link>
      </div>

      {/* --- CONTENT --- */}
      <div className="space-y-1">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-slate-300" size={20} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Fetching Registry...
            </p>
          </div>
        ) : recentLogs.length > 0 ? (
          recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between py-4 group hover:bg-slate-50 dark:hover:bg-white/5 px-4 rounded-2xl transition-all cursor-default border border-transparent hover:border-slate-100 dark:hover:border-gray-800"
            >
              <div className="flex items-center gap-4">
                {/* Avatar with Initials */}
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-400 uppercase">
                  {log.adminName.charAt(0)}
                </div>

                <div>
                  <p className="text-xs font-black text-slate-950 dark:text-white">
                    {log.adminName}
                    <span className="font-medium text-slate-400 mx-2">/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold uppercase tracking-tight">
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </p>
                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tighter mt-0.5">
                    Target: {log.entityName || log.entity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  {formatDistanceToNow(new Date(log.createdAt), {
                    addSuffix: true,
                  })}
                </p>
                <ArrowRight
                  size={14}
                  className="ml-auto text-slate-200 group-hover:text-blue-600 transition-transform group-hover:translate-x-1 mt-1"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              No recent activity recorded
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
