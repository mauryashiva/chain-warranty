"use client";

import React, { useEffect, useState } from "react";
import { getWarranties } from "@/lib/api/user/warranty";
import { Search, Package, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TransferSearch({ hook }: { hook: any }) {
  const { address } = useAuth();
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchWarranties() {
      try {
        const res: any = await getWarranties();
        
        // Filter out warranties the user doesn't own or aren't active/transferred
        const owned = res.filter((w: any) => {
          const isOwner = w.ownerWallet?.toLowerCase() === address?.toLowerCase();
          const isTransferable = w.status === "ACTIVE" || w.status === "TRANSFERRED";
          return isOwner && isTransferable;
        });
        setWarranties(owned);
      } catch (err) {
        console.error("Failed to fetch warranties", err);
      } finally {
        setLoading(false);
      }
    }
    if (address) {
      fetchWarranties();
    }
  }, [address]);

  const filtered = warranties.filter(
    (w) =>
      w.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tokenId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="mb-6 space-y-2">
        <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
          Select Warranty
        </h3>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Choose which warranty asset you want to transfer ownership of.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by product name or token ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs font-bold outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-[250px] mb-6 pr-2 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <Package size={32} className="mb-3 opacity-20" />
            <p className="text-xs font-bold">No transferable warranties found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((w) => (
              <button
                key={w.id}
                onClick={() => hook.setSelectedWarranty(w)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                  hook.selectedWarranty?.id === w.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 shadow-md shadow-blue-500/10"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1">
                    {w.productName}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <span>Token ID: {w.tokenId}</span>
                    <span>•</span>
                    <span>Brand: {w.brand}</span>
                  </div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${
                    hook.selectedWarranty?.id === w.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-transparent"
                  }`}
                >
                  <ArrowRight size={12} strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={hook.handleNextStep}
          disabled={!hook.selectedWarranty}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          NEXT STEP
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
