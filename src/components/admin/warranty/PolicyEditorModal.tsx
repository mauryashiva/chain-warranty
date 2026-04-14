"use client";

import { useRef, useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Clock,
  RefreshCw,
  Zap,
  Save,
  Loader2,
  Lock,
  Search,
  CheckCircle2,
  Filter,
  Plus,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

interface PolicyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  allProducts?: any[];
  onSave: (productId: string, data: any) => Promise<void>;
}

type FilterType = "ALL" | "SET_OVERRIDE" | "NEW";

export default function PolicyEditorModal({
  isOpen,
  onClose,
  product,
  allProducts = [],
  onSave,
}: PolicyEditorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [selectedFromList, setSelectedFromList] = useState<any>(null);

  // Schema-Mapped States
  const [formData, setFormData] = useState({
    defaultPeriod: 12,
    extendedPeriod: 0,
    maxClaimsAllowed: 3,
    claimCooldownDays: 30,
    isTransferable: true,
  });

  // ✅ FIXED: Click outside logic
  useClickOutside(modalRef, () => {
    if (!isSaving) onClose();
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setSelectedFromList(product);
        setFormData({
          defaultPeriod: product.warrantyRule?.defaultPeriod ?? 12,
          extendedPeriod: product.warrantyRule?.extendedPeriod ?? 0,
          maxClaimsAllowed: product.warrantyRule?.maxClaimsAllowed ?? 3,
          claimCooldownDays: product.warrantyRule?.claimCooldownDays ?? 30,
          isTransferable: product.warrantyRule?.isTransferable ?? true,
        });
      } else {
        setSelectedFromList(null);
        setSearchQuery("");
      }
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const activeProduct = selectedFromList || product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    setIsSaving(true);
    try {
      await onSave(activeProduct.id, {
        ...formData,
        defaultPeriod: Number(formData.defaultPeriod),
        extendedPeriod: Number(formData.extendedPeriod),
        maxClaimsAllowed: Number(formData.maxClaimsAllowed),
        claimCooldownDays: Number(formData.claimCooldownDays),
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const hasRule = !!p.warrantyRule;
    if (activeFilter === "SET_OVERRIDE") return matchesSearch && hasRule;
    if (activeFilter === "NEW") return matchesSearch && !hasRule;
    return matchesSearch;
  });

  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2 block ml-1";
  const inputClasses =
    "w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-4 ring-blue-600/10 transition-all";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-gray-800 animate-in zoom-in-95 duration-200"
      >
        {/* --- HEADER --- */}
        <div className="px-10 py-8 border-b border-slate-50 dark:border-gray-800 flex items-center justify-between bg-slate-50/30 dark:bg-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
              {activeProduct ? <ShieldCheck size={24} /> : <Filter size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">
                {activeProduct ? "Modify SKU Protocol" : "Initialize Override"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                {activeProduct
                  ? `Assigning: ${activeProduct.name}`
                  : "Search catalog to begin"}
              </p>
            </div>
          </div>
          {/* ✅ FIXED: Cross button logic */}
          <button
            type="button"
            onClick={onClose}
            className="p-3 bg-slate-100 dark:bg-gray-800 hover:bg-rose-500 hover:text-white rounded-full transition-all active:scale-90"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar"
        >
          {!product && !selectedFromList ? (
            <div className="space-y-6">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(["ALL", "SET_OVERRIDE", "NEW"] as FilterType[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={cn(
                      "flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                      activeFilter === tab
                        ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                        : "text-slate-400",
                    )}
                  >
                    {tab.replace("_", " ")}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className={cn(inputClasses, "pl-12")}
                  placeholder="Model name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid gap-2 max-h-62.5 overflow-y-auto pr-2 custom-scrollbar">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedFromList(p)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-600 hover:text-white transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-xs font-black uppercase">{p.name}</p>
                      <p className="text-[9px] font-bold opacity-60 uppercase">
                        {p.sku}
                      </p>
                    </div>
                    <Plus
                      size={18}
                      className="group-hover:rotate-90 transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* 🔒 IDENTITY */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClasses}>Model Designation</label>
                  <div className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 flex items-center gap-2 italic">
                    <Lock size={12} /> {activeProduct.name}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Serial SKU</label>
                  <div className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 flex items-center gap-2 italic">
                    <Lock size={12} /> {activeProduct.sku}
                  </div>
                </div>
              </div>

              {/* ⏳ COVERAGE */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClasses}>Base Warranty (Months)</label>
                  <div className="relative">
                    <Clock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                      size={16}
                    />
                    <input
                      type="number"
                      value={formData.defaultPeriod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultPeriod: parseInt(e.target.value) || 0,
                        })
                      }
                      className={cn(inputClasses, "pl-12")}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>
                    Extended Support (Months)
                  </label>
                  <div className="relative">
                    <Zap
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                      size={16}
                    />
                    <input
                      type="number"
                      value={formData.extendedPeriod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          extendedPeriod: parseInt(e.target.value) || 0,
                        })
                      }
                      className={cn(inputClasses, "pl-12")}
                    />
                  </div>
                </div>
              </div>

              {/* 🛡️ LIMITS */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClasses}>Max Claims Allowed</label>
                  <input
                    type="number"
                    value={formData.maxClaimsAllowed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxClaimsAllowed: parseInt(e.target.value) || 1,
                      })
                    }
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Cooldown Period (Days)</label>
                  <input
                    type="number"
                    value={formData.claimCooldownDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        claimCooldownDays: parseInt(e.target.value) || 0,
                      })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* 🔄 TOGGLE */}
              <div className="p-8 bg-slate-50 dark:bg-gray-800/40 rounded-[2.5rem] border-2 border-slate-100 dark:border-gray-800 flex items-center justify-between group">
                <div className="flex gap-4 items-center">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-lg",
                      formData.isTransferable
                        ? "bg-blue-600 text-white shadow-blue-600/20"
                        : "bg-slate-200 text-slate-400",
                    )}
                  >
                    <RefreshCw
                      size={24}
                      className={
                        formData.isTransferable ? "animate-spin-slow" : ""
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase text-slate-900 dark:text-white leading-none text-left">
                      P2P Transfer Protocol
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
                      Secondary market mobility
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isTransferable: !formData.isTransferable,
                    })
                  }
                  className={cn(
                    "w-16 h-8 rounded-full relative transition-all duration-500 border-2",
                    formData.isTransferable
                      ? "bg-blue-600 border-blue-600"
                      : "bg-slate-300 dark:bg-slate-700 border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md",
                      formData.isTransferable ? "left-9" : "left-1",
                    )}
                  />
                </button>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-gray-800">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  Commit Policy
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                >
                  Discard
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
