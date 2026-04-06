"use client";

import { useState } from "react";
import { useMintWarranty } from "@/hooks/user/use-mint-warranty"; // ✅ Matches your preferred name
import { Zap, Cpu, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MintingPanel() {
  const { executeMint, loading } = useMintWarranty();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintedId, setMintedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    walletAddress: "",
    productId: "",
    expiryYears: "1",
  });

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + parseInt(formData.expiryYears));

    try {
      const result = await executeMint(
        formData.walletAddress,
        formData.productId,
        expiry.toISOString(),
      );

      setTxHash(result.txHash);
      setMintedId(result.warranty.tokenId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* --- MINTING FORM --- */}
      <div className="lg:col-span-7">
        <div className="rounded-3xl border-2 border-gray-100 bg-white p-8 dark:border-neutral-900 dark:bg-black shadow-sm">
          <form onSubmit={handleMint} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Target Customer Wallet
              </label>
              <input
                required
                placeholder="0x..."
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 font-mono text-sm font-bold outline-none focus:border-blue-600 dark:bg-neutral-900/50 dark:border-neutral-800"
                onChange={(e) =>
                  setFormData({ ...formData, walletAddress: e.target.value })
                }
              />
            </div>
            {/* ... Other inputs same as before ... */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Zap size={18} fill="currentColor" /> MINT WARRANTY NFT
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* --- STATUS SIDEBAR --- */}
      <div className="lg:col-span-5">
        <div
          className={cn(
            "rounded-3xl border-2 p-8 transition-all duration-500",
            txHash
              ? "border-emerald-100 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-500/5"
              : "border-gray-100 bg-slate-50/50 dark:border-neutral-900 dark:bg-neutral-900/20",
          )}
        >
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
            <Cpu size={14} /> Contract Status
          </h4>

          {txHash ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-4 text-emerald-600">
                <CheckCircle2 size={32} strokeWidth={3} />
                <p className="text-sm font-black uppercase">
                  Transaction Successful
                </p>
              </div>
              {/* Token ID and Hash display here */}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-bold">
              Awaiting Contract Execution...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
