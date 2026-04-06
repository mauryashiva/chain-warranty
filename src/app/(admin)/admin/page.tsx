"use client";

import { Activity } from "lucide-react";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import ContractHealth from "@/components/admin/dashboard/ContractHealth";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed"; // Let's build this below

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🚀 Header: No Logic, Just UI */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Activity size={18} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              System Overview
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
            Command Center
          </h1>
        </div>

        {/* Quick Date Display */}
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Current Session
          </p>
          <p className="text-xs font-black text-slate-900 dark:text-white">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* 🚀 Logic Component 1: The 4 Cards */}
      <StatsGrid />

      {/* 🚀 Logic Component 2 & 3: The Activity Feed and Health Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <ActivityFeed />
        </div>

        <div className="lg:col-span-4 sticky top-28">
          <ContractHealth />
        </div>
      </div>
    </div>
  );
}
