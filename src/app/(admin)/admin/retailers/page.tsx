"use client";

import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  MapPin,
  Loader2,
  X,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddRetailerForm from "@/components/admin/retailer/AddRetailerForm";
import { useAdminRetailers } from "@/hooks/admin/use-admin-retailers";

export default function AdminRetailersPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeRetailer, setActiveRetailer] = useState<any>(null);

  // Real Data Hook
  const { retailers, loading, addRetailer, refresh } = useAdminRetailers();

  const handleSave = async (data: any) => {
    try {
      await addRetailer(data);
      setShowAddForm(false);
      refresh(); // Trigger re-fetch of real data
    } catch (err) {
      console.error("Failed to save retailer:", err);
    }
  };

  return (
    <div className="space-y-10 min-h-screen bg-white dark:bg-gray-900 pb-24 px-6 md:px-10 pt-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-gray-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            Retailers
          </h1>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 uppercase tracking-[0.2em] opacity-80">
            Authorised retailers who can sell and register products
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2.5 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] tracking-widest transition-all hover:bg-blue-700 active:scale-95 shadow-2xl shadow-blue-600/30"
        >
          <Plus size={16} strokeWidth={4} />
          ADD RETAILER
        </button>
      </div>

      {/* --- MODAL: Add Retailer Form --- */}
      {showAddForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-300 rounded-[3rem]">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-6 right-10 z-10 p-2 bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full shadow-lg transition-all active:scale-90"
            >
              <X size={20} className="text-slate-500" strokeWidth={3} />
            </button>
            <AddRetailerForm onSave={handleSave} />
          </div>
        </div>
      )}

      {/* --- MODAL: Authorised Brands Management (Real Data mapping) --- */}
      {activeRetailer && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                    Authorised Brands
                  </h2>
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                    Permissions for {activeRetailer.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveRetailer(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" strokeWidth={3} />
              </button>
            </div>

            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Maps real brands authorized for this specific retailer */}
                {activeRetailer.brands?.map((brand: any) => (
                  <div
                    key={brand.id}
                    className="flex items-center justify-between p-5 rounded-2xl border-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 transition-all"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {brand.name}
                    </span>
                    <CheckCircle2 size={18} className="text-blue-600" />
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-slate-50 dark:border-gray-800 flex justify-end">
                <button
                  onClick={() => setActiveRetailer(null)}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- RETAILER TABLE --- */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-800/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Retailer Identity
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Contact
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Location Details
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Auth Brands
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 text-center">
                  Compliance
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 text-center">
                  Status
                </th>
                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-600"
                      size={32}
                      strokeWidth={3}
                    />
                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mt-4">
                      Synchronising Partner Data...
                    </p>
                  </td>
                </tr>
              ) : retailers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      No retailers found in registry
                    </p>
                  </td>
                </tr>
              ) : (
                retailers.map((r: any) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-gray-800 text-blue-600 flex items-center justify-center font-black text-sm uppercase shadow-inner">
                          {r.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {r.name}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {r.type}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-800 dark:text-slate-200">
                          <Mail size={12} className="text-slate-400" />
                          {r.contactEmail || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Phone size={12} className="text-slate-400" />
                          {r.contactPhone || "N/A"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-900 dark:text-white uppercase">
                          <MapPin size={12} className="text-blue-500" />
                          {r.city}, {r.state}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase ml-5">
                          {r.country} • {r.pinCode}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-wrap gap-1.5 max-w-37.5">
                        {r.brands && r.brands.length > 0 ? (
                          r.brands.map((b: any) => (
                            <span
                              key={b.id}
                              className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200/50 dark:border-gray-700"
                            >
                              {b.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 italic">
                            None
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-6 text-center font-mono text-[11px] font-bold text-slate-400 uppercase">
                      {r.gstNumber || "—"}
                    </td>

                    <td className="px-6 py-6 text-center">
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border",
                          r.status === "ACTIVE"
                            ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                            : "bg-slate-100 text-slate-400 border-slate-200",
                        )}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 bg-slate-50 dark:bg-gray-800 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-slate-100 dark:border-gray-700">
                          <MoreHorizontal size={16} />
                        </button>
                        <button
                          onClick={() => setActiveRetailer(r)}
                          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all hover:opacity-80"
                        >
                          Brands
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
