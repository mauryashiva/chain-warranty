"use client";

import { History, ArrowRight } from "lucide-react";
import Link from "next/link";

const MOCK_LOGS = [
  {
    id: 1,
    admin: "Arjun Mehta",
    action: "Brand Added",
    entity: "Sony",
    time: "12m ago",
    initial: "A",
  },
  {
    id: 2,
    admin: "Priya Sharma",
    action: "Claim Resolved",
    entity: "CLM-882",
    time: "1h ago",
    initial: "P",
  },
  {
    id: 3,
    admin: "Arjun Mehta",
    action: "Product Created",
    entity: "XPS 15",
    time: "3h ago",
    initial: "A",
  },
  {
    id: 4,
    admin: "System",
    action: "Auto-Expiry",
    entity: "Warr-09",
    time: "5h ago",
    initial: "S",
  },
];

export default function ActivityFeed() {
  return (
    <div className="rounded-[2.5rem] bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-8 shadow-sm">
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
          className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
        >
          VIEW FULL LOG
        </Link>
      </div>

      <div className="space-y-1">
        {MOCK_LOGS.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between py-4 group hover:bg-slate-50 dark:hover:bg-white/5 px-4 rounded-2xl transition-colors cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-400">
                {log.initial}
              </div>
              <div>
                <p className="text-xs font-black text-slate-950 dark:text-white">
                  {log.admin}{" "}
                  <span className="font-medium text-slate-400 mx-1">—</span>{" "}
                  {log.action}
                </p>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tighter">
                  Entity: {log.entity}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400">
                {log.time}
              </p>
              <ArrowRight
                size={14}
                className="ml-auto text-slate-200 group-hover:text-blue-600 transition-colors mt-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
