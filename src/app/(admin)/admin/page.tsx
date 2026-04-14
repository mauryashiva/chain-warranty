"use client";

import { Activity, LayoutDashboard, Cpu } from "lucide-react";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import ContractHealth from "@/components/admin/dashboard/ContractHealth";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 space-y-12 pb-24 px-6 md:px-10 pt-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-gray-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 mb-3">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800/50">
              <LayoutDashboard size={16} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Admin Protocol
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Command Center
          </h1>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] opacity-80 pt-1">
            Real-time Blockchain Ecosystem Monitoring
          </p>
        </div>

        {/* Quick Date Display - Enhanced into a widget card */}
        <div className="text-left md:text-right p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 shadow-sm mt-4 md:mt-0">
          <p className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest opacity-60 mb-1">
            Current Session
          </p>
          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* --- LIVE STATS GRID (4 Main Cards) --- */}
      <section className="relative">
        <StatsGrid />
      </section>

      {/* --- DATA VISUALIZATION LAYER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
        {/* Recent Admin Activity Feed (Real Data) */}
        <div className="lg:col-span-8">
          <ActivityFeed />
        </div>

        {/* Blockchain Contract Health (Live Node Stats) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <ContractHealth />
        </div>
      </div>

      {/* --- SYSTEM STATUS FOOTER --- */}
      <div className="flex flex-wrap items-center justify-center gap-8 pt-10 pb-6 border-t border-slate-200 dark:border-gray-800">
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-800/30 px-5 py-2.5 rounded-full border border-slate-200 dark:border-gray-700">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          </div>
          <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest opacity-80">
            Database:{" "}
            <span className="text-emerald-600 dark:text-emerald-500">
              Connected
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-800/30 px-5 py-2.5 rounded-full border border-slate-200 dark:border-gray-700">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          </div>
          <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest opacity-80">
            RPC Node:{" "}
            <span className="text-emerald-600 dark:text-emerald-500">
              Online
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
