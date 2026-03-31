"use client";

import { useState } from "react";
import { QrCode, ShieldCheck, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VerifyCard() {
  const [tokenId, setTokenId] = useState("");

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            Verify Warranty
          </h3>
          <p className="text-[12px] font-bold text-slate-600 dark:text-neutral-400 mt-1">
            Enter a Token ID or scan QR code to verify authenticity
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ShieldCheck size={22} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-3">
        {/* Manual Input Group */}
        <div className="relative group">
          <Search
            size={18}
            strokeWidth={3}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
          />
          <input
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter Token ID (e.g., #1234)"
            className="h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-black text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-black"
          />
        </div>

        {/* Verify Warranty Button (Now on Top) */}
        <button className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-black text-slate-950 transition-all hover:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:hover:bg-neutral-900 active:scale-[0.98]">
          <ShieldCheck size={20} strokeWidth={3} className="text-emerald-600" />
          Verify Warranty
        </button>

        {/* Scan QR Code Button (Now at Bottom) */}
        <button className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]">
          <QrCode size={20} strokeWidth={3} />
          Scan QR Code
        </button>
      </div>
    </div>
  );
}
