"use client";

import {
  ShieldCheck,
  ExternalLink,
  Package,
  Hash,
  AlertCircle,
  User,
  Wallet,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function WarrantyTable({ warranties }: { warranties: any[] }) {
  // Helper to calculate "Days Remaining" or "Days Ago"
  const getExpirationStatus = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days ago`, isExpired: true };
    }
    return { text: `${diffDays} days left`, isExpired: false };
  };

  // Helper for Status Badge Styling - High Visibility
  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40";
      case "CLAIMED":
        return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40";
      case "EXPIRED":
        return "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40";
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/40";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {warranties.map((w) => {
        const expiryStatus = getExpirationStatus(w.expiryDate);

        return (
          <div
            key={w.id}
            className="relative group overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 p-6 transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Background Decorative Gradient */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left Side: Product Info & Image */}
              <div className="flex items-start gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                  {w.frontPhotoUrl ? (
                    <img
                      src={w.frontPhotoUrl}
                      alt={w.productName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-600">
                      <Package size={28} strokeWidth={2} />
                    </div>
                  )}
                  <div className="absolute bottom-1.5 right-1.5 rounded-lg bg-blue-600 p-1 text-white shadow-lg">
                    <ShieldCheck size={12} strokeWidth={3} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-gray-100">
                      {w.productName || w.product?.name}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest",
                        getStatusStyles(w.status),
                      )}
                    >
                      {w.status}
                    </span>
                  </div>
                  <p className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                    <span className="uppercase tracking-wider">
                      {w.category}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="font-mono text-[11px] bg-white/50 dark:bg-gray-900/50 px-1.5 rounded border border-gray-200 dark:border-gray-700">
                      SN: {w.serialNumber}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-8 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Purchased
                      </p>
                      <p className="text-xs font-black text-gray-900 dark:text-gray-100">
                        {new Date(w.purchaseDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Expires
                      </p>
                      <p className="text-xs font-black text-gray-900 dark:text-gray-100">
                        {new Date(w.expiryDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        {expiryStatus.isExpired ? "Status" : "Remaining"}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-black px-2 py-0.5 rounded-md",
                          expiryStatus.isExpired
                            ? "text-rose-600 bg-rose-500/10"
                            : "text-blue-600 bg-blue-500/10 dark:text-blue-400",
                        )}
                      >
                        {expiryStatus.text}
                      </p>
                    </div>

                    {/* OWNER NAME */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <User size={10} strokeWidth={3} /> Owner
                      </p>
                      <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">
                        {w.ownerName || "Shiva Maurya"}
                      </p>
                    </div>

                    {/* WALLET ADDRESS */}
                    <div className="space-y-1 hidden md:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Wallet size={10} strokeWidth={3} /> Wallet
                      </p>
                      <p className="text-[11px] font-mono font-bold text-gray-900 dark:text-gray-100">
                        {w.ownerWallet
                          ? `${w.ownerWallet.slice(0, 6)}...${w.ownerWallet.slice(-4)}`
                          : "0x...5443"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Blockchain Details & Actions */}
              <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 lg:border-t-0 lg:pt-0 lg:text-right dark:border-gray-700">
                <div className="space-y-2">
                  <div className="flex flex-col gap-1 lg:items-end">
                    <div className="flex items-center gap-2">
                      <Hash
                        size={14}
                        className="text-blue-500"
                        strokeWidth={3}
                      />
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">
                        NFT ID: {w.tokenId || "Pending"}
                      </span>
                    </div>
                    {/* Added Internal Warranty ID */}
                    <div className="flex items-center gap-2">
                      <Key
                        size={12}
                        className="text-emerald-500"
                        strokeWidth={3}
                      />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 px-1.5 rounded border border-gray-200 dark:border-gray-700">
                        WNT-ID: {w.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="font-mono text-[10px] font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                    Tx:{" "}
                    {w.contractAddress
                      ? `${w.contractAddress.slice(0, 12)}...${w.contractAddress.slice(-6)}`
                      : "0x000...0000"}
                  </p>
                </div>

                <div className="flex items-center gap-2 lg:justify-end">
                  <button className="flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-900 transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-700">
                    View Details
                  </button>
                  <button className="flex items-center justify-center rounded-xl bg-gray-900 p-2.5 text-white transition-all hover:bg-blue-600 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-blue-500 dark:hover:text-white shadow-lg">
                    <ExternalLink size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {warranties.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-gray-200 bg-gray-100 p-20 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 rounded-3xl bg-white p-6 text-gray-400 dark:bg-gray-900 shadow-sm">
            <AlertCircle size={48} strokeWidth={2.5} />
          </div>
          <h3 className="text-base font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">
            No Warranties Found
          </h3>
          <p className="mt-2 text-sm font-bold text-gray-600 dark:text-gray-400">
            Start by registering your first product on the blockchain.
          </p>
        </div>
      )}
    </div>
  );
}
