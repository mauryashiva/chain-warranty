"use client";

import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  Eye,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  // Mock function to determine icon based on name for the "UI look"
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
      {/* Header with Register Button */}
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
            {warranties.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert className="mb-2 text-gray-300" size={48} />
                    <p className="text-lg font-black text-slate-950 dark:text-white">
                      No warranties found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              warranties.map((w) => {
                const address =
                  w.ownerships?.[0]?.user?.wallets?.[0]?.address ?? "Unknown";
                const shortAddress =
                  address !== "Unknown"
                    ? `${address.slice(0, 4)}...${address.slice(-4)}`
                    : "Unknown";

                const expiryDate = new Date(w.expiryDate);
                const isExpiringSoon =
                  (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <
                  30;

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
                            {w.product?.name ?? "Unnamed Product"}
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
                      {new Date(w.purchaseDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                      {expiryDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider",
                          w.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
                        )}
                      >
                        {isExpiringSoon && w.status === "ACTIVE"
                          ? "Expiring Soon"
                          : w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg border-2 border-slate-200 px-4 py-1.5 text-xs font-black text-slate-950 transition-all hover:bg-slate-950 hover:text-white dark:border-neutral-700 dark:text-white dark:hover:bg-white dark:hover:text-black">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer All Warranties Link */}
      <div className="border-t-2 border-gray-100 bg-slate-50/30 p-4 text-center dark:border-neutral-900 dark:bg-transparent">
        <button className="rounded-lg border-2 border-slate-200 bg-white px-6 py-2 text-sm font-black text-blue-600 shadow-sm transition-all hover:bg-blue-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-neutral-800/50">
          View All Warranties
        </button>
      </div>
    </div>
  );
}
