"use client";

import { ShieldCheck, User, ArrowLeft, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepReviewConfirm({ data, update, onBack }: any) {
  // Logic to handle the final Minting call
  const handleFinalMint = async () => {
    console.log("Initializing Blockchain Minting...", data);
    // This will call your useMintWarranty hook
  };

  const sectionLabel =
    "text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 flex items-center gap-2";
  const rowClasses =
    "flex justify-between py-3 border-b border-slate-100 dark:border-neutral-900 last:border-0";
  const keyClasses =
    "text-[11px] font-bold text-slate-400 uppercase tracking-tight";
  const valueClasses =
    "text-[11px] font-black text-slate-950 dark:text-white text-right";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 01. OWNER INFORMATION SECTION */}
      <section className="space-y-6">
        <h4 className={sectionLabel}>
          <User size={14} strokeWidth={3} />
          Owner Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Owner full name *
            </label>
            <input
              value={data.ownerName}
              onChange={(e) => update({ ...data, ownerName: e.target.value })}
              placeholder="e.g. Arjun Mehta"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-blue-600 dark:bg-neutral-950 dark:border-neutral-800 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Owner wallet address *
            </label>
            <input
              value={data.ownerWallet}
              onChange={(e) => update({ ...data, ownerWallet: e.target.value })}
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold outline-none focus:border-blue-600 dark:bg-neutral-950 dark:border-neutral-800 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Email address
            </label>
            <input
              value={data.email}
              onChange={(e) => update({ ...data, email: e.target.value })}
              placeholder="owner@email.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-blue-600 dark:bg-neutral-950 dark:border-neutral-800 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Phone number
            </label>
            <input
              value={data.phone}
              onChange={(e) => update({ ...data, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-blue-600 dark:bg-neutral-950 dark:border-neutral-800 dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* 02. REVIEW & CONFIRM DATA GRID */}
      <section className="space-y-6">
        <h4 className={sectionLabel}>
          <ShieldCheck size={14} strokeWidth={3} />
          Review & Confirm
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 p-8 rounded-4xl bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-100 dark:border-neutral-800">
          {/* Column 1: Product Specs */}
          <div className="space-y-1">
            <div className={rowClasses}>
              <span className={keyClasses}>Product</span>
              <span className={valueClasses}>{data.productName || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Brand</span>
              <span className={valueClasses}>{data.brand || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Serial</span>
              <span className={valueClasses}>{data.serialNumber || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>IMEI / Model</span>
              <span className={valueClasses}>{data.imei || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Category</span>
              <span className={valueClasses}>{data.category || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Color / Variant</span>
              <span className={valueClasses}>{data.color || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Condition</span>
              <span className={valueClasses}>{data.condition || "—"}</span>
            </div>
          </div>

          {/* Column 2: Purchase & Files */}
          <div className="space-y-1">
            <div className={rowClasses}>
              <span className={keyClasses}>Purchase Date</span>
              <span className={valueClasses}>{data.purchaseDate || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Warranty</span>
              <span className={valueClasses}>{data.warrantyPeriod || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Price</span>
              <span className={valueClasses}>${data.price || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Retailer</span>
              <span className={valueClasses}>{data.retailer || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Invoice #</span>
              <span className={valueClasses}>{data.invoiceNumber || "—"}</span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Country</span>
              <span className={valueClasses}>{data.country || "—"}</span>
            </div>

            {/* Document Status Rows */}
            <div className={rowClasses}>
              <span className={keyClasses}>Front photo</span>
              <span
                className={cn(
                  valueClasses,
                  !data.frontPhoto && "text-rose-500 font-bold",
                )}
              >
                {data.frontPhoto ? "UPLOADED" : "NOT UPLOADED"}
              </span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Back photo</span>
              <span
                className={cn(
                  valueClasses,
                  !data.backPhoto && "text-rose-500 font-bold",
                )}
              >
                {data.backPhoto ? "UPLOADED" : "NOT UPLOADED"}
              </span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Invoice doc</span>
              <span
                className={cn(
                  valueClasses,
                  !data.invoiceDoc && "text-rose-500 font-bold",
                )}
              >
                {data.invoiceDoc ? "UPLOADED" : "NOT UPLOADED"}
              </span>
            </div>
            <div className={rowClasses}>
              <span className={keyClasses}>Warranty card</span>
              <span
                className={cn(
                  valueClasses,
                  !data.warrantyCard && "text-rose-500 font-bold",
                )}
              >
                {data.warrantyCard ? "UPLOADED" : "NOT UPLOADED"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCKCHAIN INFO CALLOUT */}
      <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-600/20 flex gap-4 items-start">
        <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <Zap size={18} fill="currentColor" />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-black text-blue-900 dark:text-blue-400 uppercase tracking-tight">
            On-Chain Finalization
          </p>
          <p className="text-[11px] font-bold text-blue-800/70 dark:text-blue-400/60 leading-relaxed">
            All uploaded images and documents will be stored on IPFS. Their
            content hashes will be written immutably into the NFT metadata
            on-chain.
          </p>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-neutral-900">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          BACK
        </button>

        <button
          onClick={handleFinalMint}
          className="group flex items-center gap-3 bg-slate-950 dark:bg-white dark:text-black text-white px-10 py-5 rounded-2xl font-black text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-900/20"
        >
          MINT WARRANTY NFT ON BLOCKCHAIN
          <ShieldCheck size={18} strokeWidth={3} className="text-blue-500" />
        </button>
      </div>
    </div>
  );
}
