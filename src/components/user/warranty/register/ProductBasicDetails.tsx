"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Package, Search, Loader2, CheckCircle2, ChevronDown, Edit3 } from "lucide-react";
import BrandSelect from "@/components/common/Form/BrandSelect";
import ProductSelect from "@/components/common/Form/ProductSelect";

const CATEGORIES = [
  "Headphones / Audio",
  "Smartphone",
  "Laptop / Computer",
  "Smart TV",
  "Camera",
  "Tablet",
  "Wearable",
  "Other electronics",
];

export default function ProductBasicDetails({
  data,
  update,
  updateWithValidation,
  errors,
  isCheckingSerial,
  handleSerialChange,
  selectedProduct,
  inputClasses,
  labelClasses,
  secondaryText,
}: any) {
  const [showOtherCategory, setShowOtherCategory] = useState(false);

  return (
    <section className="p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600">
          <Package size={16} strokeWidth={3} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 whitespace-nowrap">
          01. Basic Product Details
        </h3>
        <div className="h-px w-full bg-linear-to-r from-blue-100 to-transparent dark:from-gray-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1 md:col-span-2">
          <label className={labelClasses}>Serial number *</label>
          <div className="relative">
            <input
              value={data.serialNumber}
              onChange={(e) => handleSerialChange(e.target.value)}
              placeholder="Enter Serial to auto-fetch details..."
              className={cn(
                inputClasses,
                "pr-12 border-blue-100 dark:border-blue-900/30",
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isCheckingSerial ? (
                <Loader2 className="animate-spin text-blue-600" size={18} />
              ) : data.productId ? (
                <CheckCircle2 className="text-emerald-500" size={18} />
              ) : (
                <Search className="text-gray-300" size={18} />
              )}
            </div>
          </div>
          <p className={secondaryText}>
            Primary identifier for on-chain registry
          </p>
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Select Brand *</label>
          <BrandSelect
            value={data.brandId}
            onChange={(val: string) => updateWithValidation({ brandId: val })}
          />
          {errors.brandId && (
            <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
              ❌ {errors.brandId}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Product / Model *</label>
          <ProductSelect
            value={data.productId}
            brandId={data.brandId}
            disabled={!data.brandId}
            onChange={(val: string) => updateWithValidation({ productId: val })}
          />
          {errors.productId && (
            <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
              ❌ {errors.productId}
            </p>
          )}
          {selectedProduct && (
            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-700 dark:text-slate-300 opacity-80 mt-2">
              {selectedProduct.identificationType === "SERIAL_IMEI"
                ? "✓ Requires serial + IMEI for registration."
                : "✓ Requires serial only for registration."}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Model number</label>
          <input
            value={data.modelNumber}
            readOnly
            placeholder="Select a product to auto-fill model number"
            className={cn(
              inputClasses,
              "bg-slate-100 dark:bg-gray-900 cursor-not-allowed",
            )}
          />
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Color / Variant</label>
          <input
            value={data.color}
            onChange={(e) => update({ color: e.target.value })}
            placeholder="e.g. Midnight Black"
            className={inputClasses}
          />
        </div>

        {/* 🔥 DROPDOWN CATEGORY SECTION */}
        <div className="space-y-1 md:col-span-1">
          <label className={labelClasses}>Product Category *</label>
          <div className="relative">
            <select
              value={
                CATEGORIES.includes(data.category)
                  ? data.category
                  : data.category
                    ? "Other electronics"
                    : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === "Other electronics") {
                  setShowOtherCategory(true);
                  updateWithValidation({ category: "" }); // Reset to allow typing
                } else {
                  setShowOtherCategory(false);
                  updateWithValidation({ category: val });
                }
              }}
              className={cn(
                inputClasses,
                "appearance-none cursor-pointer pr-10",
                errors.category
                  ? "border-red-500 focus:border-red-500 focus:ring-red-600/5"
                  : "",
              )}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
          {errors.category && (
            <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
              ❌ {errors.category}
            </p>
          )}
        </div>

        {/* 🔥 "OTHER" INPUT FIELD (Conditional) */}
        {(showOtherCategory ||
          (data.category && !CATEGORIES.includes(data.category))) && (
          <div className="space-y-1 md:col-span-1 animate-in slide-in-from-left-2 duration-300">
            <label className={labelClasses}>Specify Category *</label>
            <div className="relative">
              <Edit3
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={16}
              />
              <input
                autoFocus
                value={data.category}
                onChange={(e) => update({ category: e.target.value })}
                placeholder="Type category name..."
                className={cn(
                  inputClasses,
                  "pl-12 border-blue-200 dark:border-blue-900/50",
                )}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}