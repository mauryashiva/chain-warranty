"use client";

import { useState } from "react";
import { QrCode, ShieldCheck, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
// Assuming QRScanner is your component that handles the camera feed
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
      // Logic to handle cleaning up the ID if it includes '#'
      const res = await fetch(`/api/verify?tokenId=${id.replace("#", "")}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic: Handle Image Paste ---
  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (!blob) continue;

        setIsPasting(true);
        try {
          // Creating a temporary scanner instance to process the static image file
          const html5QrCode = new Html5Qrcode("paste-temp-container");
          const decodedText = await html5QrCode.scanFile(blob, false);

          setTokenId(decodedText);
          handleVerify(decodedText);
        } catch (err) {
          console.error("Paste scan failed:", err);
          // Optional: Add a UI toast/notification here instead of alert
          alert("No valid QR code detected in the pasted image.");
        } finally {
          setIsPasting(false);
        }
      }
    }
  };

  return (
    <div className="rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black transition-all">
      {/* Hidden container for background processing of pasted images */}
      <div id="paste-temp-container" className="hidden"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Verify Warranty
          </h3>
          <p className="text-[13px] font-bold text-slate-600 dark:text-neutral-400 mt-1">
            Input Token ID, scan QR, or paste a QR image to verify.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-900/30">
          <ShieldCheck size={22} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-3">
        {/* Input Field */}
        {!showScanner && (
          <div className="relative group">
            <Search
              size={18}
              strokeWidth={3}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
            />
            <input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onPaste={handlePaste}
              placeholder={
                isPasting ? "Processing Image..." : "Enter ID or Paste QR Image"
              }
              disabled={isPasting}
              className={cn(
                "h-14 w-full rounded-2xl border-2 pl-12 pr-4 text-sm font-black outline-none transition-all",
                // Light Mode
                "border-slate-100 bg-slate-50/50 text-slate-950 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white",
                // Dark Mode
                "dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:bg-neutral-800",
                isPasting && "opacity-50 cursor-wait",
              )}
            />
          </div>
        )}

        {/* QR Scanner Section */}
        {showScanner ? (
          <div
            key="scanner-active"
            className="relative overflow-hidden rounded-2xl border-2 border-dashed border-emerald-500 bg-black p-1 aspect-square"
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/70 to-transparent">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                Camera Active
              </span>
              <button
                onClick={() => setShowScanner(false)}
                className="flex items-center gap-1 text-[10px] font-black text-white bg-red-600 px-2 py-1 rounded-md hover:bg-red-700 transition-colors shadow-lg"
              >
                <X size={12} strokeWidth={4} />
                CANCEL
              </button>
            </div>

            <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-xl">
              <QRScanner
                onScan={(data) => {
                  setTokenId(data);
                  setShowScanner(false);
                  handleVerify(data);
                }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || isPasting}
              className={cn(
                "flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 text-sm font-black transition-all active:scale-[0.98] disabled:opacity-50",
                "border-slate-200 bg-white text-slate-950 hover:bg-slate-950 hover:text-white",
                "dark:border-neutral-700 dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-black",
              )}
            >
              <ShieldCheck
                size={20}
                strokeWidth={3}
                className="text-emerald-600"
              />
              {loading ? "VERIFYING..." : "Verify Warranty"}
            </button>

            {/* Scan Button */}
            <button
              onClick={() => {
                setResult(null);
                setShowScanner(true);
              }}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 text-sm font-black text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 dark:hover:bg-emerald-500 active:scale-[0.98]"
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
