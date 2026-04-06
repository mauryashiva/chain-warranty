"use client";

import { useState } from "react";
import { useWarrantyClaims } from "@/hooks/user/use-warranty-claims";
import {
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClaimForm({ warrantyId }: { warrantyId?: string }) {
  const { submitClaim, loading } = useWarrantyClaims();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    type: "REPAIR",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warrantyId) return alert("Select a warranty first");

    try {
      await submitClaim(warrantyId, formData.type, formData.reason);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (success) {
    return (
      <div className="rounded-[2.5rem] bg-emerald-50 p-12 text-center border-2 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-900/30">
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-950 dark:text-white">
          Claim Submitted
        </h3>
        <p className="mt-2 text-sm font-bold text-slate-500">
          Your request is under review. Our team will verify the blockchain
          status of your asset.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="rounded-3xl border-2 border-gray-100 bg-white p-8 dark:border-neutral-900 dark:bg-black">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Step 1 of 1
            </p>
            <h4 className="text-lg font-black text-slate-950 dark:text-white">
              Request Warranty Service
            </h4>
          </div>
        </div>

        <div className="space-y-6">
          {/* Claim Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Service Type
            </label>
            <select
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 text-sm font-bold outline-none focus:border-blue-600 dark:bg-neutral-900/50 dark:border-neutral-800"
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="REPAIR">Repair Request</option>
              <option value="REPLACEMENT">Full Replacement</option>
              <option value="REFUND">Product Refund</option>
            </select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Problem Description
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the issue with your product..."
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 text-sm font-bold outline-none focus:border-blue-600 dark:bg-neutral-900/50 dark:border-neutral-800 resize-none"
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border-2 border-blue-100 dark:border-blue-900/30">
        <AlertCircle size={20} className="text-blue-600 shrink-0" />
        <p className="text-[11px] font-bold text-blue-800 dark:text-blue-400 leading-relaxed">
          Submitting a claim initiates an investigation into the product's
          history. Please provide accurate information to avoid a high fraud
          score in our verification system.
        </p>
      </div>

      <button
        disabled={loading || !warrantyId}
        className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-950 py-5 text-sm font-black text-white transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white shadow-2xl"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            SUBMIT OFFICIAL CLAIM
            <ArrowRight
              size={18}
              strokeWidth={3}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>
    </form>
  );
}
