"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Wallet, ChevronDown, Search } from "lucide-react";
import { CURRENCIES } from "@/components/common/currencies";
import { cn } from "@/lib/utils";

export default function RecipientDetails({ hook }: { hook: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
      <div className="mb-6 space-y-2">
        <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
          Initiate Warranty Transfer
        </h3>
      </div>

      <div className="flex-1 space-y-6">
        {hook.selectedWarranty && (
          <div className="bg-gray-900 text-white rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-medium border border-gray-800">
            <div>
              <div className="text-gray-400 mb-1">Product</div>
              <div className="font-bold text-sm truncate">{hook.selectedWarranty.productName}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Serial</div>
              <div className="font-bold text-gray-200 truncate">{hook.selectedWarranty.serialNumber || hook.selectedWarranty.tokenId}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Current owner</div>
              <div className="font-bold text-gray-200 truncate">{hook.selectedWarranty.ownerName || "Current User"}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">From wallet</div>
              <div className="font-bold text-gray-200 truncate">
                {hook.selectedWarranty.ownerWallet ? `${hook.selectedWarranty.ownerWallet.slice(0, 6)}...${hook.selectedWarranty.ownerWallet.slice(-4)}` : "Unknown"}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest flex items-center gap-2">
              New owner name
            </label>
            <input
              type="text"
              value={hook.ownerName}
              onChange={(e) => hook.setOwnerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest flex items-center gap-2">
              <Wallet size={12} />
              New owner wallet address *
            </label>
            <input
              type="text"
              value={hook.recipientWallet}
              onChange={(e) => hook.setRecipientWallet(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-mono font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest flex items-center gap-2">
              New owner email
            </label>
            <input
              type="email"
              value={hook.ownerEmail}
              onChange={(e) => hook.setOwnerEmail(e.target.value)}
              placeholder="newowner@email.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest">
              Transfer Reason
            </label>
            <div className="relative">
              <select
                value={hook.reason}
                onChange={(e) => hook.setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 appearance-none pr-10"
              >
                <option value="SOLD">Sold the product</option>
                <option value="GIFT">Gifted</option>
                <option value="OTHER">Other</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* 🔍 CURRENCY FIELD WITH FIXES */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest">
              Sale price (optional)
            </label>
            <div className="relative flex w-full h-[46px]">
              <div className="relative w-[110px] shrink-0 z-20 h-full" ref={dropdownRef}>
                {/* Main Trigger Box */}
                <div 
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn(
                    "flex items-center justify-between h-full px-4 rounded-l-2xl border border-r-0 transition-all cursor-pointer",
                    "border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                    isOpen && "border-blue-600 ring-1 ring-blue-600/20"
                  )}
                >
                  <span className="text-[13px] font-black text-gray-900 dark:text-white truncate">
                    {hook.currency} ({CURRENCIES.find(c => c.code === hook.currency)?.symbol || "$"})
                  </span>
                  <ChevronDown className={cn("text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} size={14} />
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute top-[110%] left-0 w-64 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          type="text"
                          autoFocus
                          placeholder="Search currency..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-bold outline-none border border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {filteredCurrencies.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => {
                            hook.setCurrency(c.code);
                            setIsOpen(false);
                            setSearchTerm("");
                          }}
                          className={cn(
                            "px-4 py-3 text-[11px] font-black flex items-center justify-between cursor-pointer transition-all",
                            // Fix: High contrast hover and selection
                            "hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white", 
                            hook.currency === c.code 
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400" 
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <span className="truncate">{c.code} — {c.name}</span>
                          <span className="ml-2 opacity-60 text-[10px]">{c.symbol}</span>
                        </div>
                      ))}
                      {filteredCurrencies.length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
                          No Results Found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Input Field */}
              <input
                type="number"
                value={hook.salePrice}
                onChange={(e) => hook.setSalePrice(e.target.value)}
                placeholder="0.00"
                className="flex-1 w-full h-full px-4 rounded-r-2xl border border-gray-200 border-l-0 bg-white text-[13px] font-black outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-500 text-xs font-semibold leading-relaxed mt-4">
          Transferring this warranty will permanently update the NFT owner on-chain. This action is irreversible.
        </div>
      </div>

      <div className="flex justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={hook.handlePrevStep}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-black transition"
        >
          <ArrowLeft size={14} />
          BACK
        </button>
        <button
          onClick={hook.handleNextStep}
          disabled={!hook.recipientWallet}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          REVIEW TRANSFER
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}