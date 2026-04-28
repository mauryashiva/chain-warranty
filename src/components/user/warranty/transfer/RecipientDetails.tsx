"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Wallet, Info, ChevronDown } from "lucide-react";
import { CURRENCIES } from "@/components/common/currencies";

export default function RecipientDetails({ hook }: { hook: any }) {
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
            {hook.reason === "OTHER" && (
              <input
                type="text"
                value={hook.customReason}
                onChange={(e) => hook.setCustomReason(e.target.value)}
                placeholder="Please specify reason"
                className="w-full mt-2 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 animate-in fade-in slide-in-from-top-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest flex justify-between items-end">
              Sale price (optional)
            </label>
            <div className="relative flex">
              <div className="relative w-32 border-r border-gray-200 dark:border-gray-700 z-10">
                <select
                  value={hook.currency}
                  onChange={(e) => hook.setCurrency(e.target.value)}
                  className="w-full h-full px-3 py-3 rounded-l-2xl border border-gray-200 border-r-0 bg-gray-50 text-[13px] font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 appearance-none pr-8 truncate"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  {CURRENCIES.map(c => (
                    c.code !== "USD" && c.code !== "INR" && (
                      <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                    )
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
              <input
                type="number"
                value={hook.salePrice}
                onChange={(e) => hook.setSalePrice(e.target.value)}
                placeholder="e.g. 200"
                className="flex-1 px-4 py-3 rounded-r-2xl border border-gray-200 border-l-0 bg-white text-[13px] font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-500 text-xs font-semibold leading-relaxed mt-4">
          Transferring this warranty will permanently update the NFT owner on-chain. This action is irreversible. Active claims must be resolved before transfer.
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
