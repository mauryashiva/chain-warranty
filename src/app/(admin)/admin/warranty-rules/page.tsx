"use client";

import { useState } from "react";
import {
  Globe,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

// ✅ Hooks & Components
import { useAdminWarrantyRules } from "@/hooks/admin/use-admin-warrenty-rule";
import GlobalSettings from "@/components/admin/warranty/GlobalSettings";
import ProductRuleTable from "@/components/admin/warranty/ProductRuleTable";
import PolicyEditorModal from "@/components/admin/warranty/PolicyEditorModal";

export default function WarrantyRulesPage() {
  const {
    products,
    globalConfig,
    loading,
    error,
    updateGlobalConfig,
    saveProductRule,
    refresh,
  } = useAdminWarrantyRules();

  // 🏛️ Consolidated UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<any | null>(null);

  /**
   * 🔄 Update Global Baseline
   */
  const handleGlobalUpdate = async (config: any): Promise<void> => {
    try {
      await updateGlobalConfig(config);
    } catch (err) {
      console.error("Global protocol sync failed:", err);
    }
  };

  /**
   * 💾 Commit SKU-level Overrides
   */
  const handleSaveOverride = async (productId: string, data: any) => {
    try {
      await saveProductRule(productId, data);
      setIsModalOpen(false);
      setTargetProduct(null);
    } catch (err) {
      console.error("Policy commitment failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-white dark:bg-gray-900">
        <div className="relative">
          <Loader2
            className="animate-spin text-blue-600"
            size={56}
            strokeWidth={1.5}
          />
          <ShieldCheck
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600/50"
            size={20}
          />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-800 dark:text-slate-200 animate-pulse">
          Syncing Policy Engine...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center bg-white dark:bg-gray-900">
        <div className="p-6 rounded-full bg-rose-50 dark:bg-rose-950/20 mb-6">
          <AlertCircle className="text-rose-600" size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Protocol Sync Failure
        </h3>
        <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          The engine could not connect to the governance smart contract.
        </p>
        <button
          onClick={() => refresh()}
          className="mt-10 flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
        >
          <RefreshCcw size={14} strokeWidth={3} /> Re-Initialize Engine
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 space-y-16 pb-32 px-6 md:px-10 pt-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* --- HEADER AREA --- */}
      {/* FIXED: items-start keeps text on top, button aligned correctly, with margin-bottom to clear the border */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-slate-200 dark:border-gray-800">
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Policy Engine
          </h1>
          <div className="flex items-center gap-3 pt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-[0.15em] opacity-80">
              Governance for Blockchain Warranties
            </p>
          </div>
        </div>

        {/* FIXED: mt-4 ensures spacing on mobile. self-center on desktop fixes vertical drift */}
        <button
          onClick={() => {
            setTargetProduct(null);
            setIsModalOpen(true);
          }}
          className="mt-4 md:mt-0 md:self-center flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-[11px] tracking-widest uppercase shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all"
        >
          <Plus size={18} strokeWidth={4} />
          Create Protocol Override
          <ArrowUpRight size={16} className="opacity-50 ml-1" />
        </button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 gap-y-20">
        {/* --- GLOBAL CONFIG SECTION --- */}
        <section className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
              <Globe
                size={18}
                className="text-emerald-600 dark:text-emerald-500"
              />
            </div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
              Global Standards
            </h2>
          </div>

          <div className="p-1 rounded-[2.5rem] bg-slate-50 dark:bg-gray-800/30 border border-slate-200 dark:border-gray-800 shadow-sm">
            <GlobalSettings
              initialData={globalConfig}
              onUpdate={handleGlobalUpdate}
            />
          </div>
        </section>

        {/* --- PRODUCT RULES SECTION --- */}
        {/* FIXED: Added pt-10 to separate this section from the Global Config above it */}
        <section className="relative pt-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 shadow-sm">
                <Zap size={18} className="text-amber-500" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                Active SKU Logic
              </h2>
            </div>
            <span className="text-[10px] font-bold py-1.5 px-4 bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200 rounded-full border border-slate-200 dark:border-gray-700 uppercase tracking-widest shadow-sm">
              {products?.length || 0} Products Indexed
            </span>
          </div>

          <div className="bg-white dark:bg-transparent border border-slate-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
            <ProductRuleTable
              products={products}
              onEditRule={(p) => {
                setTargetProduct(p);
                setIsModalOpen(true);
              }}
            />
          </div>
        </section>
      </div>

      {/* --- UNIVERSAL MODAL LAYER --- */}
      <PolicyEditorModal
        isOpen={isModalOpen}
        product={targetProduct}
        allProducts={products}
        onClose={() => {
          setIsModalOpen(false);
          setTargetProduct(null);
        }}
        onSave={handleSaveOverride}
      />
    </div>
  );
}
