"use client";

import { useState, useRef } from "react";
import {
  ShieldCheck,
  Plus,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Loader2,
  QrCode,
  X,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeCanvas } from "qrcode.react"; // Switched to Canvas for copying support

type WarrantyListProps = {
  warranties: Array<{
    id: string;
    tokenId: string;
    status: string;
    product?: { name: string; brand?: string } | null;
    purchaseDate: string;
    expiryDate: string;
    ownerships: Array<{ user: { id: string; wallets: { address: string }[] } }>;
  }>;
};

export default function WarrantyList({ warranties }: WarrantyListProps) {
  // --- States ---
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [results, setResults] = useState<
    Record<string, "valid" | "invalid" | null>
  >({});
  const [selectedQr, setSelectedQr] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  // --- Refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Logic: Copy QR Code ---
  const handleCopyQr = async () => {
    if (!canvasRef.current) return;

    try {
      setIsCopying(true);
      const canvas = canvasRef.current;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);

        // Visual feedback
        setTimeout(() => {
          setIsCopying(false);
        }, 2000);
      }, "image/png");
    } catch (err) {
      console.error("Failed to copy image", err);
      setIsCopying(false);
    }
  };

  // --- Verification Logic ---
  const handleVerify = async (tokenId: string) => {
    setVerifyingId(tokenId);
    setResults((prev) => ({ ...prev, [tokenId]: null }));
    try {
      const res = await fetch(`/api/verify?tokenId=${tokenId}`);
      const data = await res.json();
      setResults((prev) => ({
        ...prev,
        [tokenId]: data.valid ? "valid" : "invalid",
      }));
      setTimeout(() => {
        setResults((prev) => ({ ...prev, [tokenId]: null }));
      }, 3000);
    } catch (err) {
      setResults((prev) => ({ ...prev, [tokenId]: "invalid" }));
    } finally {
      setVerifyingId(null);
    }
  };

  const getProductIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("iphone")) return <Smartphone size={20} />;
    if (n.includes("macbook")) return <Laptop size={20} />;
    if (n.includes("sony") || n.includes("headphone"))
      return <Headphones size={20} />;
    return <Watch size={20} />;
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-black overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-100 px-6 py-5 dark:border-neutral-900">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">
          My Warranties
        </h2>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-95">
          <Plus size={18} strokeWidth={3} />
          Register New Warranty
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-50 bg-slate-50/50 dark:border-neutral-900 dark:bg-neutral-900/30">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                Product
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                Token ID
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                Purchase Date
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                Expiry Date
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-900">
            {warranties.map((w) => {
              const address =
                w.ownerships?.[0]?.user?.wallets?.[0]?.address ?? "Unknown";
              const shortAddress =
                address !== "Unknown"
                  ? `${address.slice(0, 4)}...${address.slice(-4)}`
                  : "Unknown";
              const isLoading = verifyingId === w.tokenId;
              const result = results[w.tokenId];

              return (
                <tr
                  key={w.id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-neutral-900/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-slate-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        {getProductIcon(w.product?.name ?? "")}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-950 dark:text-white leading-none mb-1">
                          {w.product?.name}
                        </span>
                        <span className="text-[11px] font-bold text-blue-600 uppercase">
                          Owned by {shortAddress}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-black text-slate-600 dark:text-neutral-400">
                    #{w.tokenId}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                    {new Date(w.purchaseDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                    {new Date(w.expiryDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedQr(w.tokenId)}
                        className="p-2 rounded-lg border-2 border-slate-200 text-slate-950 hover:bg-slate-100 transition-all dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900"
                        title="Show QR Code"
                      >
                        <QrCode size={14} strokeWidth={2.5} />
                      </button>

                      <button
                        onClick={() => handleVerify(w.tokenId)}
                        disabled={isLoading}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-black transition-all",
                          result === "valid" &&
                            "border-emerald-500 bg-emerald-50 text-emerald-700",
                          result === "invalid" &&
                            "border-red-500 bg-red-50 text-red-700",
                          !result &&
                            "border-slate-200 text-slate-950 hover:bg-slate-950 hover:text-white dark:border-neutral-700 dark:text-white",
                        )}
                      >
                        {isLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <ShieldCheck size={14} />
                        )}
                        {isLoading
                          ? "Wait..."
                          : result === "valid"
                            ? "Verified"
                            : result === "invalid"
                              ? "Failed"
                              : "Verify"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- QR MODAL POPUP --- */}
      {selectedQr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl dark:bg-neutral-900 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedQr(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <X size={20} strokeWidth={3} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                <QrCode size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                Warranty QR Code
              </h3>
              <p className="mt-1 text-sm font-bold text-slate-500 mb-8">
                Scan to verify Token #{selectedQr}
              </p>

              {/* The Actual QR Code Canvas */}
              <div className="rounded-2xl border-4 border-slate-50 bg-white p-4 shadow-inner dark:border-neutral-800">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={selectedQr}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Copy Image Button */}
              <button
                onClick={handleCopyQr}
                className={cn(
                  "mt-6 flex items-center gap-2 text-sm font-black transition-all",
                  isCopying
                    ? "text-emerald-600"
                    : "text-blue-600 hover:text-blue-700",
                )}
              >
                {isCopying ? (
                  <>
                    <Check size={16} strokeWidth={3} /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy size={16} strokeWidth={3} /> Copy QR as Image
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedQr(null)}
                className="mt-6 w-full rounded-xl bg-slate-950 py-3 text-sm font-black text-white hover:bg-black dark:bg-white dark:text-black"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
