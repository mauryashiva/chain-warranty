"use client";

import {
  Users,
  Package,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  {
    label: "Total Brands",
    value: "6",
    change: "+1",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Active Products",
    value: "24",
    change: "+4",
    icon: Package,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "Warranties Issued",
    value: "1.2k",
    change: "+12%",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Open Claims",
    value: "23",
    change: "5 high",
    icon: AlertTriangle,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="p-6 rounded-4xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl", stat.bg, "dark:bg-gray-800")}>
              <stat.icon size={22} className={stat.color} />
            </div>
            <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
              LIVE
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {stat.label}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {stat.value}
            </h3>
            <span className="text-[10px] font-bold text-slate-400">
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
