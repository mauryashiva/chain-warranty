"use client";

import { useState } from "react";
import { useTransferWarranty } from "@/hooks/user/use-transfer-warranty";
import {
  MoveRight,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TransferForm({
  warrantyId,
  tokenId,
}: {
  warrantyId: string;
  tokenId: string;
}) {
  const { transfer, loading } = useTransferWarranty();
  const [toWallet, setToWallet] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transfer(warrantyId, toWallet);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/warranties"), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95">
        <div className="h-20 w-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-6">
          <CheckCircle2 size={40} strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-black text-slate-950 dark:text-white">
          Transfer Initiated
        </h3>
        <p className="mt-2 text-sm font-bold text-slate-500">
          Ownership is being updated on the blockchain...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleTransfer} className="space-y-8">
      <div className="rounded-3xl border-2 border-gray-100 bg-white p-8 dark:border-neutral-900 dark:bg-black">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Asset to Transfer
            </p>
            <p className="text-lg font-black text-slate-950 dark:text-white">
              Warranty NFT #{tokenId}
            </p>
          </div>
          <ShieldCheck className="text-blue-600" size={32} />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Recipient Wallet Address
          </label>
          <input
            required
            placeholder="0x..."
            className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 font-mono text-sm font-bold outline-none focus:border-blue-600 dark:bg-neutral-900/50 dark:border-neutral-800"
            onChange={(e) => setToWallet(e.target.value)}
          />
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-2xl bg-amber-50 p-4 border-2 border-amber-100 dark:bg-amber-500/5 dark:border-amber-900/30">
          <AlertTriangle className="text-amber-600 shrink-0" size={20} />
          <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400 leading-relaxed">
            Warning: Digital asset transfers are permanent. Ensure the recipient
            address is correct. You will lose access to this warranty once the
            transfer is confirmed.
          </p>
        </div>
      </div>

      <button
        disabled={loading || !toWallet}
        className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-950 py-5 text-sm font-black text-white transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white shadow-2xl"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            CONFIRM & SEND WARRANTY
            <MoveRight
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
