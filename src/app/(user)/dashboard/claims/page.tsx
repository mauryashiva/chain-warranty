"use client";

import ClaimForm from "@/components/user/warranty/ClaimForm";
import { ClipboardList, ShieldQuestion } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ClaimsPage() {
  const searchParams = useSearchParams();
  const warrantyId = searchParams.get("id");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
          <ClipboardList size={20} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Support & Logistics
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white">
          Warranty Claims
        </h1>
        <p className="mt-3 text-base font-bold text-slate-500 dark:text-neutral-400">
          File a claim for repair, replacement, or refund. All claims are
          audited against the blockchain record for maximum security.
        </p>
      </div>

      {warrantyId ? (
        <ClaimForm warrantyId={warrantyId} />
      ) : (
        <div className="max-w-2xl rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-slate-50/30 p-16 text-center dark:border-neutral-800">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-200 dark:bg-neutral-800 flex items-center justify-center text-slate-400 mb-6">
            <ShieldQuestion size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-950 dark:text-white">
            No Asset Selected
          </h3>
          <p className="mt-2 text-sm font-bold text-slate-400">
            Please go to "My Warranties" and click on "File Claim" for the
            product you wish to service.
          </p>
        </div>
      )}
    </div>
  );
}
