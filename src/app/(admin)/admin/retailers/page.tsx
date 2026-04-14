"use client";

import { useState } from "react";
import {
  Plus,
  MapPin,
  Loader2,
  X,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Settings2,
  Globe,
  Building2,
  Laptop,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddRetailerForm from "@/components/admin/retailer/AddRetailerForm";
import EditRetailerModal from "@/components/admin/retailer/EditRetailerModal";
import { useAdminRetailers } from "@/hooks/admin/use-admin-retailers";

export default function AdminRetailersPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeBrandsPreview, setActiveBrandsPreview] = useState<any>(null);
  const [editingRetailer, setEditingRetailer] = useState<any>(null);

  // Real Data Hook
  const { retailers, loading, addRetailer, updateRetailer, refresh } =
    useAdminRetailers();

  const handleSave = async (data: any) => {
    try {
      await addRetailer(data);
      setShowAddForm(false);
      refresh();
    } catch (err) {
      console.error("Failed to save retailer:", err);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateRetailer(id, data);
      setEditingRetailer(null);
      refresh();
    } catch (err) {
      console.error("Failed to update retailer:", err);
    }
  };

  return (
    <div className="space-y-10 min-h-screen bg-white dark:bg-gray-900 pb-24 px-6 md:px-10 pt-4">
      {/* Header Area - Shifted Left/Upper */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 dark:border-gray-800 pb-6">
        <div className="text-left">
          <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Retailers
          </h3>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight mt-2">
            Authorised retailers who can sell and register products
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2.5 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] tracking-widest transition-all hover:bg-blue-700 active:scale-95 shadow-2xl shadow-blue-600/30"
        >
          <Plus size={14} strokeWidth={4} />
          ADD RETAILER
        </button>
      </div>

      {/* --- MODAL: Add Retailer Form --- */}
      {showAddForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-300 rounded-[3rem]">
            <AddRetailerForm
              onSave={handleSave}
              onClose={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* --- MODAL: Edit Retailer Form --- */}
      {editingRetailer && (
        <EditRetailerModal
          isOpen={!!editingRetailer}
          retailer={editingRetailer}
          onClose={() => setEditingRetailer(null)}
          onSave={handleUpdate}
        />
      )}

      {/* --- MODAL: Authorised Brands Preview --- */}
      {activeBrandsPreview && (
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
                    Permissions for {activeBrandsPreview.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveBrandsPreview(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" strokeWidth={3} />
              </button>
            </div>

            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {activeBrandsPreview.brands?.map((brand: any) => (
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
                  onClick={() => setActiveBrandsPreview(null)}
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
          <table className="w-full text-left border-collapse min-w-275">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-800/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[22%]">
                  Retailer Identity
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[12%]">
                  Type
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[18%]">
                  Communication
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[18%]">
                  Geo Presence
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[12%]">
                  Compliance
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 text-center w-[8%]">
                  Status
                </th>
                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[10%]">
                  Management
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-32 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-600"
                      size={40}
                      strokeWidth={3}
                    />
                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mt-6">
                      Synchronising Partner Network...
                    </p>
                  </td>
                </tr>
              ) : retailers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                      <Building2 size={40} />
                      <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                        Empty Registry
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                retailers.map((r: any) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-white dark:bg-gray-800 text-blue-600 flex items-center justify-center font-black text-xs uppercase shadow-sm border border-slate-100 dark:border-gray-700">
                          {r.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {r.name}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            ID: {r.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* New Column: Retailer Type */}
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2">
                        {r.type === "ONLINE" ? (
                          <Laptop size={14} className="text-blue-500" />
                        ) : (
                          <StoreIcon size={14} className="text-emerald-500" />
                        )}
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">
                          {r.type}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-8">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          <Mail size={12} className="text-slate-400" />
                          <span className="truncate max-w-30">
                            {r.contactEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Phone size={12} className="text-slate-400" />
                          {r.contactPhone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          <MapPin
                            size={12}
                            className="text-blue-600 shrink-0"
                          />
                          <span className="truncate">
                            {r.city}, {r.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase ml-3.75">
                          {r.country} • {r.pinCode}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          GST/TAX
                        </span>
                        <span className="font-mono text-[10px] font-black text-slate-900 dark:text-slate-100">
                          {r.gstNumber || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-8 text-center">
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[8px] font-black uppercase border tracking-tighter",
                          r.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20",
                        )}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => setEditingRetailer(r)}
                          className="group/btn p-2.5 bg-slate-50 dark:bg-gray-800 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-slate-100 dark:border-gray-700"
                        >
                          <Settings2
                            size={14}
                            className="group-hover/btn:rotate-90 transition-transform duration-500"
                          />
                        </button>

                        <button
                          onClick={() => setActiveBrandsPreview(r)}
                          className="px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all"
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
