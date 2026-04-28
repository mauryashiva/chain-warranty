"use client";

import React from "react";
import { ArrowLeft, Send, ShieldAlert, Loader2 } from "lucide-react";

export default function TransferReview({ hook }: { hook: any }) {
  const { selectedWarranty, recipientWallet, reason, customReason, ownerName, ownerEmail, salePrice, currency, isTransferring, handlePrevStep, handleTransfer } = hook;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
      <div className="mb-8 space-y-2">
        <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="text-blue-500" size={20} strokeWidth={3} />
          Review & Confirm
        </h3>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Please review the details. This action writes to the blockchain and is irreversible.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 space-y-4">
          <div className="space-y-1 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Warranty Details
            </h4>
            <div className="flex justify-between items-center py-2">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</span>
              <span className="text-[12px] font-black text-gray-900 dark:text-white">{selectedWarranty.productName}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Token ID</span>
              <span className="text-[12px] font-black text-gray-900 dark:text-white">{selectedWarranty.tokenId}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Serial</span>
              <span className="text-[12px] font-black text-gray-900 dark:text-white">{selectedWarranty.serialNumber}</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 pt-2">
              Transfer To
            </h4>
            <div className="flex justify-between items-center py-2">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient Wallet</span>
              <span className="text-[11px] font-mono font-black text-blue-600 dark:text-blue-400">{recipientWallet}</span>
            </div>
            {ownerName && (
              <div className="flex justify-between items-center py-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Owner Name</span>
                <span className="text-[12px] font-black text-gray-900 dark:text-white">{ownerName}</span>
              </div>
            )}
            {ownerEmail && (
              <div className="flex justify-between items-center py-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Owner Email</span>
                <span className="text-[12px] font-black text-gray-900 dark:text-white">{ownerEmail}</span>
              </div>
            )}
            {reason && (
              <div className="flex justify-between items-center py-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</span>
                <span className="text-[12px] font-black text-gray-900 dark:text-white">
                  {reason === "OTHER" ? (customReason || "Other") : reason}
                </span>
              </div>
            )}
            {salePrice && (
              <div className="flex justify-between items-center py-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sale Price</span>
                <span className="text-[12px] font-black text-gray-900 dark:text-white">{salePrice} {currency}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handlePrevStep}
          disabled={hook.loading}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-black transition disabled:opacity-50"
        >
          <ArrowLeft size={14} />
          BACK
        </button>
        <button
          onClick={hook.transfer}
          disabled={hook.loading}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white text-xs font-black hover:scale-[1.02] transition shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hook.loading ? (
            <>
              TRANSFERRING...
              <Loader2 size={14} className="animate-spin" />
            </>
          ) : (
            <>
              CONFIRM TRANSFER
              <Send size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
