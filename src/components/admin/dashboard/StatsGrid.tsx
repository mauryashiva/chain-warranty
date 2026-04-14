"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminApiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export default function StatsGrid() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApiFetch<any>(endpoints.admin.dashboard.stats);
        setData(res);
      } catch (error) {
        console.error("Stats Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const STATS_CONFIG = [
    {
      label: "Brand Registry",
      mainValue: data?.brands?.active || 0,
      subValue: data?.brands?.total || 0,
      subLabel: "Total Registered",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Active Products",
      mainValue: data?.products?.active || 0,
      subValue: data?.products?.total || 0,
      subLabel: "Total SKUs",
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      label: "Warranties Issued",
      mainValue:
        data?.warranties >= 1000
          ? `${(data.warranties / 1000).toFixed(1)}k`
          : data?.warranties || 0,
      subValue: null,
      subLabel: "Live NFT Assets",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Pending Claims",
      mainValue: data?.claims || 0,
      subValue: null,
      subLabel: "Action Required",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 animate-pulse flex items-center justify-center"
          >
            <Loader2 className="animate-spin text-slate-200" size={24} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS_CONFIG.map((stat) => (
        <div
          key={stat.label}
          className="p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div
              className={cn(
                "p-4 rounded-2xl transition-all group-hover:rotate-6 duration-500",
                stat.bg,
              )}
            >
              <stat.icon size={24} className={stat.color} />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-tighter">
                Live
              </span>
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
            {stat.label}
          </p>

          <div className="flex flex-col mt-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-slate-950 dark:text-white tracking-tighter">
                {stat.mainValue}
              </h3>
              {stat.subValue !== null && (
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  / {stat.subValue}
                </span>
              )}
            </div>

            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1 tracking-wide">
              {stat.subLabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
