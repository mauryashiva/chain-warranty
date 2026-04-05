"use client";

import { useState } from "react";
import {
  QrCode,
  ShieldCheck,
  Search,
  X,
  AlertCircle,
  Calendar,
  Package,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import QRScanner from "@/components/qr/QRScanner";
import { Html5Qrcode } from "html5-qrcode";

export default function VerifyCard() {
  const [tokenId, setTokenId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  const handleVerify = async (idToVerify?: string) => {
    const id = idToVerify || tokenId;
    if (!id) return;
    setLoading(true);
    setResult(null);

    try {
      const cleanId = id.toString().replace("#", "").trim();
      const res = await fetch(`/api/verify?tokenId=${cleanId}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        valid: false,
        message: "Network error occurred during verification.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (!blob) continue;

        setIsPasting(true);
        try {
          const html5QrCode = new Html5Qrcode("paste-temp-container");
          const decodedText = await html5QrCode.scanFile(blob, false);
          setTokenId(decodedText);
          handleVerify(decodedText);
        } catch (err) {
          setResult({
            valid: false,
            message: "No valid QR code detected in image.",
          });
        } finally {
          setIsPasting(false);
        }
      }
    }
  };

  const getExpiryDetails = (dateStr: string) => {
    const now = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      isExpired: diffDays < 0,
      days: Math.abs(diffDays),
      formatted: expiry.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  };

  return (
    <div className="rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all">
      <div id="paste-temp-container" className="hidden"></div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-gray-100">
            Verify Warranty
          </h3>
          <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 mt-1 uppercase tracking-wider">
            Blockchain Authentication Protocol
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-600/10">
          <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-4">
        {!showScanner && (
          <div className="relative group">
            <Search
              size={18}
              strokeWidth={3}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600"
            />
            <input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onPaste={handlePaste}
              placeholder={
                isPasting ? "PROCESSING IMAGE..." : "ENTER ID OR PASTE QR"
              }
              disabled={isPasting}
              className={cn(
                "h-14 w-full rounded-2xl border-2 pl-12 pr-4 text-xs font-black outline-none transition-all uppercase tracking-widest",
                "border-gray-100 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white",
                // FIX: Added dark:focus:bg-gray-900 to prevent full white background on focus in dark mode
                "dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-500 dark:focus:bg-gray-900",
              )}
            />
          </div>
        )}

        {showScanner ? (
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-blue-500 bg-gray-900 p-1 aspect-square">
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] font-black text-white bg-blue-600 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                LENS ACTIVE
              </span>
              <button
                onClick={() => setShowScanner(false)}
                className="h-8 w-8 flex items-center justify-center text-white bg-gray-900/50 backdrop-blur-md rounded-full hover:bg-rose-600 transition-colors"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
            <QRScanner
              onScan={(data) => {
                setTokenId(data);
                setShowScanner(false);
                handleVerify(data);
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleVerify()}
              disabled={loading || isPasting}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-200 bg-white text-xs font-black uppercase tracking-widest text-gray-900 hover:bg-gray-950 hover:text-white dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-500" />
              )}
              {loading ? "VERIFYING..." : "Verify Identity"}
            </button>

            <button
              onClick={() => {
                setResult(null);
                setShowScanner(true);
              }}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
            >
              <QrCode size={18} strokeWidth={3} />
              Scan QR Passport
            </button>
          </div>
        )}
      </div>

      {/* --- Detailed Result Section --- */}
      {result && (
        <div
          className={cn(
            "mt-6 p-6 rounded-4xl border-2 animate-in fade-in slide-in-from-top-2 duration-500",
            result.valid
              ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20"
              : "bg-rose-50/50 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/20",
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            {result.valid ? (
              <CheckCircle2 size={20} className="text-emerald-600" />
            ) : (
              <AlertCircle size={20} className="text-rose-600" />
            )}
            <span
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.2em]",
                result.valid
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400",
              )}
            >
              {result.valid ? "Identity Confirmed" : "Authentication Failed"}
            </span>
          </div>

          {result.warranty ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-500/10 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                    Product
                  </p>
                  <p className="text-xs font-black text-gray-900 dark:text-white">
                    {result.warranty.productName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-500/10">
                  <p className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">
                    <Calendar size={10} /> Valid Until
                  </p>
                  <p className="text-[11px] font-black text-gray-900 dark:text-white">
                    {getExpiryDetails(result.warranty.expiryDate).formatted}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-500/10">
                  <p className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">
                    <Clock size={10} /> Status
                  </p>
                  <p
                    className={cn(
                      "text-[11px] font-black",
                      getExpiryDetails(result.warranty.expiryDate).isExpired
                        ? "text-rose-500"
                        : "text-emerald-500",
                    )}
                  >
                    {getExpiryDetails(result.warranty.expiryDate).isExpired
                      ? `Expired ${getExpiryDetails(result.warranty.expiryDate).days}d ago`
                      : `${getExpiryDetails(result.warranty.expiryDate).days} Days Left`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2">
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 leading-relaxed">
                {result.message ||
                  "This token ID does not exist in the blockchain registry or has been revoked."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
