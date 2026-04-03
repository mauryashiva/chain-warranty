"use client";

import { ShieldCheck, MoreHorizontal, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WarrantyTable({ warranties }: { warranties: any[] }) {
  return (
    <div className="rounded-3xl border-2 border-gray-100 bg-white shadow-sm dark:border-neutral-900 dark:bg-black overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-gray-50 bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:border-neutral-900 dark:bg-neutral-900/50">
            <th className="px-6 py-5">Product</th>
            <th className="px-6 py-5">Token ID</th>
            <th className="px-6 py-5">Expiry Date</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-50 dark:divide-neutral-900">
          {warranties.map((w) => (
            <tr
              key={w.id}
              className="group hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition-colors"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
                    <ShieldCheck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950 dark:text-white">
                      {w.product?.name}
                    </p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
                      Verified NFT
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 font-mono text-xs font-black text-slate-600 dark:text-neutral-400">
                #{w.tokenId}
              </td>
              <td className="px-6 py-5 text-xs font-bold text-slate-700 dark:text-neutral-300">
                {new Date(w.expiryDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-5">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {w.status}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <button className="rounded-lg p-2 hover:bg-white border-2 border-transparent hover:border-gray-200 transition-all dark:hover:bg-neutral-800">
                  <ExternalLink
                    size={16}
                    className="text-slate-400 group-hover:text-blue-600"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
