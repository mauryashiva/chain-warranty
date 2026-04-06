"use client";

import { useState } from "react";
import { useRegisterWarranty } from "@/hooks/user/use-register-warranty";
import { ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  // Destructure 'register' and 'isRegistering' from your actual hook
  const { register, isRegistering } = useRegisterWarranty();
  const router = useRouter();

  const [formData, setFormData] = useState({
    productId: "",
    // purchaseDate is handled automatically by the hook's API call,
    // but we keep expiryDate in the local state for the form input.
    expiryDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // We pass only the two arguments your hook expects
      await register(formData.productId, formData.expiryDate);

      // Redirect after success
      router.push("/dashboard/warranties");
    } catch (err: any) {
      // You might want to use a toast library here instead of alert
      alert(err.message || "Something went wrong during registration.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product ID Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Product Reference
          </label>
          <input
            required
            type="text"
            placeholder="e.g. clm12345678"
            className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-white text-sm font-bold outline-none focus:border-blue-600 dark:bg-black dark:border-neutral-800"
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
            }
          />
        </div>

        {/* Expiry Date Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Warranty Expiry
          </label>
          <input
            required
            type="date"
            className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-white text-sm font-bold outline-none focus:border-blue-600 dark:bg-black dark:border-neutral-800"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData({ ...formData, expiryDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/5 border-2 border-blue-100 dark:border-blue-900/30">
        <div className="flex gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Zap size={20} strokeWidth={3} />
          </div>
          <div>
            <p className="text-sm font-black text-blue-900 dark:text-blue-400 uppercase tracking-tight">
              On-Chain Minting
            </p>
            <p className="text-xs font-bold text-blue-700/70 dark:text-blue-400/60 leading-relaxed">
              By clicking register, we will mint a unique NFT representing your
              warranty on the blockchain. This process is irreversible and
              secure.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isRegistering}
        className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-950 py-5 text-sm font-black text-white transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white shadow-2xl"
      >
        {isRegistering ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            GENERATE BLOCKCHAIN WARRANTY
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
