"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  ArrowLeft,
  Zap,
  FileCheck,
  FileX,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { cn, formatWallet } from "@/lib/utils";
import { useRegisterWarranty } from "@/hooks/use-register-warranty";
import { useAuth } from "@/context/AuthContext"; // 🔥 Added to fetch wallet automatically

export default function StepReviewConfirm({ data, update, onBack }: any) {
  const { register, isRegistering } = useRegisterWarranty();
  const { address } = useAuth(); // 🔥 Get the connected wallet address
  const [error, setError] = useState<string | null>(null);

  // 🔥 Industry Standard: Auto-sync the connected wallet to the form data
  useEffect(() => {
    if (address && data.ownerWallet !== address) {
      update({ ...data, ownerWallet: address });
    }
  }, [address]);

  const handleFinalMint = async () => {
    try {
      setError(null);
      // Ensure we have a wallet address before proceeding
      if (!address) {
        throw new Error("No wallet connected. Please connect MetaMask.");
      }

      const result = await register(data, address);

      if (result) {
        console.log("Warranty Successfully Minted:", result);
      }
    } catch (err: any) {
      setError(err.message || "Failed to register warranty. Please try again.");
    }
  };

  const getPreview = (file: any): string => {
    if (!file) return "";
    if (typeof file === "string") return file;
    if (file instanceof Blob || file instanceof File) {
      try {
        return URL.createObjectURL(file);
      } catch (e) {
        return "";
      }
    }
    return "";
  };

  const sectionLabel =
    "text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2.5";

  const rowClasses =
    "flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0";
  const keyClasses =
    "text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider";
  const valueClasses =
    "text-[12px] font-black text-gray-900 dark:text-gray-100 text-right";

  const StatusBadge = ({ exists }: { exists: any }) => (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-tighter transition duration-200",
        exists
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
          : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20",
      )}
    >
      {exists ? <FileCheck size={10} /> : <FileX size={10} />}
      {exists ? "UPLOADED" : "NOT UPLOADED"}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white dark:bg-gray-900 min-h-screen p-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold animate-in shake duration-300">
          {error}
        </div>
      )}

      {/* 01. OWNER INFORMATION SECTION */}
      <section className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h4 className={sectionLabel}>
          <User size={14} strokeWidth={3} className="text-blue-500" />
          Owner Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Owner full name *",
              value: data.ownerName,
              key: "ownerName",
              placeholder: "e.g. Arjun Mehta",
            },
            {
              label: "Owner wallet address *",
              value: formatWallet(data.ownerWallet),
              key: "ownerWallet",
              placeholder: "Connect wallet to populate...",
              mono: true,
              readOnly: true, // 🔥 Industry Standard: Prevent manual tampering
            },
            {
              label: "Email address",
              value: data.email,
              key: "email",
              placeholder: "owner@email.com",
            },
            {
              label: "Phone number",
              value: data.phone,
              key: "phone",
              placeholder: "+91 98765 43210",
            },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 tracking-widest">
                {field.label}
              </label>
              <input
                disabled={isRegistering}
                readOnly={field.readOnly}
                title={
                  field.key === "ownerWallet" ? data.ownerWallet : undefined
                }
                value={field.value || ""}
                onChange={(e) =>
                  update({ ...data, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[13px] font-bold outline-none transition duration-200",
                  "focus:border-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 disabled:opacity-50",
                  field.readOnly &&
                    "bg-gray-50 dark:bg-gray-950/50 cursor-not-allowed border-dashed",
                  field.mono && "font-mono text-[11px]",
                )}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 02. REVIEW & CONFIRM DATA GRID */}
      <section className="space-y-6">
        <h4 className={sectionLabel}>
          <ShieldCheck size={14} strokeWidth={3} className="text-blue-500" />
          Review & Confirm
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
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

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className={keyClasses + " block mb-3"}>
                Attachment Previews
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "frontPhoto", label: "Front" },
                  { key: "backPhoto", label: "Back" },
                  { key: "invoiceDoc", label: "Invoice" },
                  { key: "warrantyCard", label: "Warranty" },
                ].map((img) => {
                  const previewUrl = getPreview(data[img.key]);
                  return (
                    <div
                      key={img.key}
                      className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 overflow-hidden flex items-center justify-center relative group"
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt={img.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon
                          className="text-gray-400 dark:text-gray-600"
                          size={16}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

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

            <div className="pt-4 space-y-1">
              <div className={rowClasses}>
                <span className={keyClasses}>Front photo</span>
                <StatusBadge exists={data.frontPhoto} />
              </div>
              <div className={rowClasses}>
                <span className={keyClasses}>Back photo</span>
                <StatusBadge exists={data.backPhoto} />
              </div>
              <div className={rowClasses}>
                <span className={keyClasses}>Invoice doc</span>
                <StatusBadge exists={data.invoiceDoc} />
              </div>
              <div className={rowClasses}>
                <span className={keyClasses}>Warranty card</span>
                <StatusBadge exists={data.warrantyCard} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCKCHAIN INFO CALLOUT */}
      <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-600/20 flex gap-4 items-center">
        <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <Zap size={18} fill="currentColor" />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-black text-blue-900 dark:text-blue-400 uppercase tracking-tight">
            On-Chain Finalization
          </p>
          <p className="text-[11px] font-bold text-blue-800/70 dark:text-blue-400/60 leading-relaxed">
            All uploaded images and documents will be stored on Supabase. Their
            content hashes will be written immutably into the NFT metadata
            on-chain.
          </p>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          disabled={isRegistering}
          onClick={onBack}
          className="group flex items-center gap-2 px-4 py-2 text-xs font-black text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition duration-200 disabled:opacity-50"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          BACK
        </button>

        <button
          disabled={isRegistering || !address}
          onClick={handleFinalMint}
          className="group flex items-center gap-3 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white px-8 py-4 rounded-xl font-black text-xs hover:scale-[1.02] active:scale-[0.98] transition duration-200 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isRegistering ? (
            <>
              MINTING...
              <Loader2 size={18} className="animate-spin text-blue-500" />
            </>
          ) : (
            <>
              MINT WARRANTY NFT ON BLOCKCHAIN
              <ShieldCheck
                size={18}
                strokeWidth={3}
                className="text-blue-500"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
