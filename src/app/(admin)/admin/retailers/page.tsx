"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Store,
  Globe,
  MapPin,
  Loader2,
  X,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddRetailerForm from "@/components/admin/retailer/AddRetailerForm";
import { useAdminRetailers } from "@/hooks/admin/use-admin-retailers";

export default function AdminRetailersPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeRetailer, setActiveRetailer] = useState<any>(null);
  const { retailers, loading, addRetailer } = useAdminRetailers();

  const handleSave = async (data: any) => {
    await addRetailer(data);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 min-h-screen bg-white dark:bg-gray-900 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            Retailers
          </h1>
          <p className="text-sm font-bold text-slate-600 dark:text-gray-400 mt-1 uppercase tracking-wider">
            Authorised retailers who can sell and register products
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={4} />
          ADD RETAILER
        </button>
      </div>

      {/* --- MODAL: Add Retailer Form --- */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button for Modal */}
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

      {/* --- MODAL: Authorised Brands --- */}
      {activeRetailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-600 text-white">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                    Authorised Brands
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block ml-1">
                  Select Permitted Brands
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["Sony", "Samsung", "Apple", "LG", "Dell", "HP"].map(
                    (brand) => (
                      <button
                        key={brand}
                        className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 dark:border-gray-800 hover:border-blue-600 transition-all group"
                      >
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase">
                          {brand}
                        </span>
                        <CheckCircle2
                          size={18}
                          className="text-slate-200 group-hover:text-blue-600 transition-colors"
                        />
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-gray-800 flex justify-end gap-3">
                <button
                  onClick={() => setActiveRetailer(null)}
                  className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setActiveRetailer(null)}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95"
                >
                  Update Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- RETAILER TABLE --- */}
      <div className="bg-gray-100 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Retailer
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Type
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Location
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  GST No.
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Sales
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700 bg-white dark:bg-gray-900/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-600"
                      size={32}
                    />
                  </td>
                </tr>
              ) : (
                retailers.map((r: any) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-blue-600 flex items-center justify-center font-black text-sm uppercase">
                          {r.name[0]}
                        </div>
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          {r.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">
                      {r.type}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[11px] font-black text-slate-600 dark:text-gray-400 uppercase">
                        <MapPin size={12} className="text-blue-500" />
                        {r.city}, {r.state}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-[11px] font-bold text-slate-400">
                      {r.gstNumber}
                    </td>
                    <td className="px-8 py-6 text-xs font-black text-slate-900 dark:text-white">
                      {r._count?.serials || 0} Units
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase border border-emerald-500/20">
                        {r.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-[10px] font-black uppercase text-blue-600 hover:underline active:scale-95 transition-all">
                          Edit
                        </button>
                        <button
                          onClick={() => setActiveRetailer(r)}
                          className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
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
