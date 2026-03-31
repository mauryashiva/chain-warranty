"use client";

import { useState } from "react";
import { QrCode, ShieldCheck, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
// Assuming QRScanner is your component that handles the camera feed
import QRScanner from "@/components/qr/QRScanner";

export default function VerifyCard() {
  const [tokenId, setTokenId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!tokenId) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/verify?tokenId=${tokenId}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Verify Warranty
          </h3>
          <p className="text-[13px] font-bold text-slate-600 dark:text-neutral-400 mt-1">
            Enter a Token ID or scan QR code to verify authenticity
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-900/30">
          <ShieldCheck size={22} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-3">
        {/* Input Field with Search Icon */}
        {!showScanner && (
          <div className="relative group">
            <Search
              size={18}
              strokeWidth={3}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
            />
            <input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter Token ID (e.g., #1234)"
              className="h-14 w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-12 pr-4 text-sm font-black text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white"
            />
          </div>
        )}

        {/* QR Scanner Section with Cancel Option */}
        {showScanner ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50/10 p-2 dark:bg-emerald-500/5">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                Camera Active
              </span>
              <button
                onClick={() => setShowScanner(false)}
                className="flex items-center gap-1 text-xs font-black text-red-500 hover:text-red-700 transition-colors"
              >
                <X size={14} strokeWidth={3} />
                CANCEL
              </button>
            </div>
            <QRScanner
              onScan={(data) => {
                setTokenId(data);
                setShowScanner(false);
              }}
            />
          </div>
        ) : (
          <>
            {/* Verify Warranty Button (Top) */}
            <button
              onClick={handleVerify}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white text-sm font-black text-slate-950 transition-all hover:bg-slate-50 dark:border-neutral-800 dark:bg-black dark:text-white active:scale-[0.98] disabled:opacity-50"
            >
              <ShieldCheck
                size={20}
                strokeWidth={3}
                className="text-emerald-600"
              />
              {loading ? "VERIFYING..." : "Verify Warranty"}
            </button>

            {/* Scan QR Code Button (Bottom) */}
            <button
              onClick={() => setShowScanner(true)}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 text-sm font-black text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <QrCode size={20} strokeWidth={3} />
              Scan QR Code
            </button>
          </>
        )}
      </div>

      {/* Result Section */}
      {result && (
        <div
          className={cn(
            "mt-4 p-4 rounded-xl border-2 font-black text-sm text-center animate-in fade-in zoom-in-95",
            result.valid
              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-900/50 dark:text-emerald-400"
              : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-900/50 dark:text-red-400",
          )}
        >
          {result.valid
            ? "✅ VALID BLOCKCHAIN WARRANTY"
            : "❌ INVALID OR EXPIRED WARRANTY"}
        </div>
      )}
    </div>
  );
}
