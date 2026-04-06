"use client";

import { useState } from "react";
import { useVerifyWarranty } from "@/hooks/user/use-verify-warranty";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Hash,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VerifySearch() {
  const [tokenId, setTokenId] = useState("");
  const { verify, status, result, reset } = useVerifyWarranty();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    verify(tokenId);
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Search Input Area */}
      <form onSubmit={handleSearch} className="relative group">
        <Search
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
          size={24}
          strokeWidth={3}
        />
        <input
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter Token ID (e.g. 10)..."
          className="w-full rounded-4xl border-4 border-gray-100 bg-white py-6 pl-16 pr-32 text-lg font-black text-slate-950 outline-none transition-all focus:border-blue-600 dark:border-neutral-900 dark:bg-black dark:text-white shadow-2xl shadow-slate-200/50 dark:shadow-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl bg-blue-600 px-6 py-3 text-xs font-black text-white hover:bg-blue-700 transition-all active:scale-95"
        >
          {status === "loading" ? "VERIFYING..." : "VERIFY NOW"}
        </button>
      </form>

      {/* Result Cards */}
      {status !== "idle" && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          {status === "success" && result && (
            <div className="rounded-[2.5rem] border-2 border-emerald-100 bg-emerald-50/50 p-10 dark:border-emerald-900/30 dark:bg-emerald-500/5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="h-20 w-20 rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40">
                    <ShieldCheck size={40} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-emerald-950 dark:text-emerald-400">
                      Authentic Asset
                    </h3>
                    <p className="text-sm font-bold text-emerald-700/70">
                      Blockchain verification successful
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="p-3 rounded-full hover:bg-emerald-100 text-emerald-600 transition-colors"
                >
                  <RefreshCcw size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50">
                    Product Name
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    iPhone 15 Pro
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50">
                    Expiry Date
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {new Date(result.warranty.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800/50">
                    Status
                  </p>
                  <p className="text-sm font-black text-emerald-600 uppercase">
                    ● ACTIVE
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-[2.5rem] border-2 border-rose-100 bg-rose-50/50 p-10 dark:border-rose-900/30 dark:bg-rose-500/5 text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-4">
                <ShieldAlert size={32} strokeWidth={3} />
              </div>
              <h3 className="text-xl font-black text-rose-950 dark:text-rose-400">
                Verification Failed
              </h3>
              <p className="mt-2 text-sm font-bold text-rose-700/70">
                {result?.message || "Invalid or expired Token ID"}
              </p>
              <button
                onClick={reset}
                className="mt-6 text-xs font-black uppercase tracking-widest text-rose-600 underline"
              >
                Try another ID
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
