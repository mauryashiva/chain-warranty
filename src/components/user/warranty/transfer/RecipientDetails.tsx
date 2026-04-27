"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Wallet, Info } from "lucide-react";

export default function RecipientDetails({ hook }: { hook: any }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
      <div className="mb-8 space-y-2">
        <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
          Recipient Details
        </h3>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Enter the wallet address of the new owner.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest flex items-center gap-2">
            <Wallet size={12} />
            Recipient Wallet Address *
          </label>
          <input
            type="text"
            value={hook.recipientWallet}
            onChange={(e) => hook.setRecipientWallet(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-mono font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          />
          <p className="text-[10px] text-gray-500 font-bold flex items-start gap-1.5 mt-2">
            <Info size={12} className="shrink-0 mt-0.5 text-blue-500" />
            Double check this address. Transferring a warranty is permanent and cannot be undone on the blockchain.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest">
            Transfer Reason (Optional)
          </label>
          <select
            value={hook.reason}
            onChange={(e) => hook.setReason(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-bold outline-none transition duration-200 focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="">Select a reason</option>
            <option value="SOLD">Sold the product</option>
            <option value="GIFT">Gifted</option>
            <option value="OTHER">Other</option>
          </select>
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
