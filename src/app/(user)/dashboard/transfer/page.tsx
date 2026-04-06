"use client";

import TransferForm from "@/components/user/warranty/TransferForm";
import { Repeat } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function TransferPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const tokenId = searchParams.get("tokenId");

  return (
    <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 lg:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
          <Repeat size={20} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Ownership Migration
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white">
          Transfer Ownership
        </h1>
        <p className="mt-3 text-base font-bold text-slate-500 dark:text-neutral-400 leading-relaxed">
          Move your verified product warranty to a different blockchain wallet.
          This process updates the smart contract and the central registry.
        </p>
      </div>

      {id ? (
        <TransferForm warrantyId={id} tokenId={tokenId || "N/A"} />
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center dark:border-neutral-800">
          <p className="text-sm font-bold text-slate-400">
            Please select a warranty from your list to initiate a transfer.
          </p>
        </div>
      )}
    </div>
  );
}
