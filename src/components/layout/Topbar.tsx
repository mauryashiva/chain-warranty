"use client";

import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Search, Bell, LogOut, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Topbar() {
  // Use the global auth state and logout function
  const { address, logout, isMounted } = useAuth();

  return (
    <div className="flex h-full items-center justify-between px-8 bg-white border-b-2 border-gray-100 dark:border-neutral-900 backdrop-blur-md dark:bg-black sticky top-0 z-50">
      {/* Search Section */}
      <div className="relative flex w-full max-w-md items-center group">
        <Search
          size={18}
          strokeWidth={3}
          className="absolute left-3.5 text-slate-950 transition-colors group-focus-within:text-blue-600 dark:text-white"
        />
        <input
          placeholder="Search for warranties or transactions..."
          className="h-11 w-full rounded-xl border-2 border-gray-200 bg-slate-50 pl-11 pr-4 text-sm font-black text-slate-950 outline-none transition-all placeholder:text-slate-500 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:bg-black"
        />
        <div className="absolute right-3 hidden items-center gap-1 sm:flex">
          <kbd className="pointer-events-none h-6 select-none items-center gap-1 rounded border-2 border-gray-300 bg-white px-2 font-mono text-[10px] font-black text-slate-950 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Network Status Badge */}
        <div className="hidden items-center gap-2 rounded-full border-2 border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-500/30 dark:bg-emerald-500/10 md:flex">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">
            Network Connected
          </span>
        </div>

        {/* Wallet & Auth Section */}
        <div className="flex items-center gap-3 border-l-2 border-gray-100 pl-4 dark:border-neutral-900">
          {/* We use isMounted to prevent hydration flicker. 
              The wallet only shows once the client-side context is ready.
          */}
          {isMounted && address ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-1.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                <Wallet size={14} className="text-blue-600" />
                <span className="text-xs font-black text-slate-950 dark:text-white">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-all hover:bg-rose-600 hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white active:scale-90"
              >
                <LogOut size={18} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="flex items-center px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg">
              <span className="text-[10px] font-black uppercase tracking-tighter text-rose-600">
                {isMounted ? "Not Connected" : "Initializing..."}
              </span>
            </div>
          )}

          <div className="ml-2">
            <ThemeToggle />
          </div>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-transparent text-slate-950 transition-all hover:bg-slate-100 hover:border-slate-200 dark:text-white dark:hover:bg-neutral-900 dark:hover:border-neutral-800">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-black"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
