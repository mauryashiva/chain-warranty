"use client";

import { useState, useRef } from "react";
import {
  ShieldCheck,
  Plus,
  Loader2,
  QrCode,
  X,
  Copy,
  Check,
  Package,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeCanvas } from "qrcode.react";

type WarrantyListProps = {
  warranties: Array<{
    id: string;
    tokenId: string;
    status: string;
    productName?: string;
    product?: { name: string; brand?: string } | null;
    purchaseDate: string;
    expiryDate: string;
    category?: string;
    serialNumber?: string;
    frontPhotoUrl?: string;
    ownerName?: string;
    ownerWallet?: string;
    contractAddress?: string;
  }>;
};

export default function WarrantyList({ warranties }: WarrantyListProps) {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [results, setResults] = useState<
    Record<string, "valid" | "invalid" | null>
  >({});
  const [selectedQr, setSelectedQr] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCopyQr = async () => {
    if (!canvasRef.current) return;
    try {
      setIsCopying(true);
      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        setTimeout(() => setIsCopying(false), 2000);
      }, "image/png");
    } catch (err) {
      setIsCopying(false);
    }
  };

  const handleVerify = async (tokenId: string) => {
    setVerifyingId(tokenId);
    try {
      const res = await fetch(`/api/verify?tokenId=${tokenId}`);
      const data = await res.json();
      setResults((prev) => ({
        ...prev,
        [tokenId]: data.valid ? "valid" : "invalid",
      }));
      setTimeout(
        () => setResults((prev) => ({ ...prev, [tokenId]: null })),
        3000,
      );
    } catch (err) {
      setResults((prev) => ({ ...prev, [tokenId]: "invalid" }));
    } finally {
      setVerifyingId(null);
    }
  };

  const getExpirationStatus = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays < 0
      ? { text: `${Math.abs(diffDays)} days ago`, isExpired: true }
      : { text: `${diffDays} days remaining`, isExpired: false };
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 animate-in fade-in duration-700">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">
          My Warranties
        </h2>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95">
          <Plus size={16} strokeWidth={4} />
          REGISTER NEW
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {warranties.map((w) => {
          const expiryStatus = getExpirationStatus(w.expiryDate);
          const isLoading = verifyingId === w.tokenId;
          const result = results[w.tokenId];

          return (
            <div
              key={w.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-5 transition-all hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex gap-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
                  {w.frontPhotoUrl ? (
                    <img
                      src={w.frontPhotoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Package size={24} strokeWidth={2} />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 rounded bg-blue-600 p-0.5 text-white shadow">
                    <ShieldCheck size={10} strokeWidth={3} />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-gray-100">
                      {w.productName || w.product?.name}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border",
                        expiryStatus.isExpired
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                      )}
                    >
                      {expiryStatus.isExpired ? "EXPIRED" : "ACTIVE"}
                    </span>
                  </div>

                  {/* SUBTITLE SECTION WITH THE REQUESTED WNT-ID BOX */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {w.category || "Asset"} • SN-{w.serialNumber || "N/A"}
                    </p>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                      WNT-ID: {w.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 py-3 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Purchased
                      </p>
                      <p className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase">
                        {new Date(w.purchaseDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Expires
                      </p>
                      <p className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase">
                        {new Date(w.expiryDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {expiryStatus.isExpired ? "Expired" : "Status"}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-black uppercase",
                          expiryStatus.isExpired
                            ? "text-rose-500"
                            : "text-emerald-500",
                        )}
                      >
                        {expiryStatus.text}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Owner
                      </p>
                      <p className="text-xs font-black text-blue-600 dark:text-blue-400 truncate uppercase">
                        {w.ownerName || "Default Owner"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 font-mono text-[10px] font-bold text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5 uppercase">
                    Tx:{" "}
                    {w.contractAddress
                      ? `${w.contractAddress.slice(0, 10)}...${w.contractAddress.slice(-4)}`
                      : "0x..."}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="flex items-center gap-1.5 uppercase">
                    NFT ID: {w.tokenId}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="flex items-center gap-1.5 uppercase">
                    Wallet:{" "}
                    {w.ownerWallet
                      ? `${w.ownerWallet.slice(0, 6)}...${w.ownerWallet.slice(-4)}`
                      : "0x..."}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedQr(w.tokenId)}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-900 hover:text-white dark:border-gray-700 dark:bg-gray-900 dark:text-white transition-all shadow-sm"
                  >
                    <QrCode size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => handleVerify(w.tokenId)}
                    disabled={isLoading}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all shadow-sm",
                      result === "valid"
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : result === "invalid"
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white dark:bg-gray-900 dark:border-gray-700 dark:text-white",
                    )}
                  >
                    {isLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={12} strokeWidth={3} />
                    )}
                    {isLoading
                      ? "Checking..."
                      : result === "valid"
                        ? "Valid"
                        : result === "invalid"
                          ? "Fake"
                          : "Verify"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm rounded-[2.5rem] bg-white p-10 shadow-2xl dark:bg-gray-800">
            <button
              onClick={() => setSelectedQr(null)}
              className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
            >
              <X size={24} strokeWidth={4} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-600">
                <QrCode size={32} strokeWidth={3} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase">
                Asset Passport
              </h3>
              <p className="mt-1 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                ID: #{selectedQr}
              </p>
              <div className="mt-8 rounded-3xl border-8 border-gray-50 bg-white p-6 shadow-inner dark:border-gray-900">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={selectedQr}
                  size={180}
                  level="H"
                />
              </div>
              <button
                onClick={handleCopyQr}
                className={cn(
                  "mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all",
                  isCopying
                    ? "text-emerald-600"
                    : "text-blue-600 hover:opacity-80",
                )}
              >
                {isCopying ? (
                  <>
                    <Check size={14} strokeWidth={4} /> Copied Image
                  </>
                ) : (
                  <>
                    <Copy size={14} strokeWidth={4} /> Copy to Clipboard
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedQr(null)}
                className="mt-8 w-full rounded-xl bg-gray-900 py-4 text-xs font-black uppercase tracking-widest text-white dark:bg-white dark:text-gray-900 shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
