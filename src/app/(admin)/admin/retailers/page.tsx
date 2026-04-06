"use client";

import {
  Store,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  MapPin,
  MoreVertical,
} from "lucide-react";
import { useAdminRetailers } from "@/hooks/admin/use-admin-retailers";
import { cn } from "@/lib/utils";

export default function AdminRetailersPage() {
  const { retailers, loading } = useAdminRetailers();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Retailers
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
            Manage authorized sales channels and partners.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
          <Plus size={16} strokeWidth={3} /> ADD RETAILER
        </button>
      </div>

      {/* Retailer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs font-bold text-slate-400">
            Loading partners...
          </p>
        ) : (
          retailers.map((shop: any) => (
            <div
              key={shop.id}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-4xl p-6 group hover:border-blue-500/50 transition-all shadow-sm hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Store size={24} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                  <ShieldCheck size={10} /> Authorized
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {shop.name}
              </h3>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-4">
                <MapPin size={12} /> {shop.location}
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Warranties
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {shop._count.warranties}
                  </p>
                </div>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
