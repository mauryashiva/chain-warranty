"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  DollarSign,
  ArrowRight,
  Package,
  ShoppingCart,
  CheckCircle2,
  CalendarCheck,
  Search,
  Loader2,
  Hash,
  Layers,
  ChevronDown,
  Edit3,
} from "lucide-react";

// Integrated your custom selectors
import BrandSelect from "@/components/common/Form/BrandSelect";
import ProductSelect from "@/components/common/Form/ProductSelect";
// 🌍 Composable Location Selector
import LocationRoot, {
  CountryField,
} from "@/components/common/Form/LocationSelector";

const CONDITIONS = ["New", "Open box", "Refurbished", "Pre-owned"];
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
const PERIODS = [
  "1 year",
  "2 years",
  "3 years",
  "5 years",
  "Lifetime",
  "Other",
];

export default function StepProductInfo({ data, update, onNext }: any) {
  const [isCheckingSerial, setIsCheckingSerial] = useState(false);
  const [showOtherCategory, setShowOtherCategory] = useState(false);

  // 🔥 Bridge LocationSelector state with the 'update' prop
  const locationValues = {
    country: data.country || "",
  };

  const handleLocationChange = (field: string, value: string) => {
    update({ [field]: value });
  };

  // 🔥 LOGIC: Auto-Calculate Expiry Date
  useEffect(() => {
    if (data.purchaseDate && data.warrantyPeriod) {
      const purchase = new Date(data.purchaseDate);
      const yearsMatch = data.warrantyPeriod.match(/\d+/);
      const yearsToAdd = yearsMatch ? parseInt(yearsMatch[0]) : 1;
      const expiry = new Date(purchase);
      expiry.setFullYear(expiry.getFullYear() + yearsToAdd);
      const formattedExpiry = expiry.toISOString().split("T")[0];

      if (data.expiryDate !== formattedExpiry) {
        update({ expiryDate: formattedExpiry });
      }
    }
  }, [data.purchaseDate, data.warrantyPeriod]);

  // 🔥 LOGIC: Auto-Fetch Product by Serial
  const handleSerialChange = async (serial: string) => {
    update({ serialNumber: serial });

    if (serial.length >= 6) {
      setIsCheckingSerial(true);
      try {
        const res = await fetch(`/api/user/verify?serial=${serial}`);
        const result = await res.json();

        if (result.success && result.data) {
          update({
            brandId: result.data.brandId,
            productId: result.data.id,
            productName: result.data.name,
            brand: result.data.brand?.name,
          });
        }
      } catch (err) {
        console.log("No matching product found in registry.");
      } finally {
        setIsCheckingSerial(false);
      }
    }
  };

  const inputClasses =
    "w-full px-5 py-4 rounded-xl border border-gray-200 bg-white text-sm font-medium outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:border-blue-500 h-[52px] flex items-center";
  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2.5 block ml-1";
  const secondaryText =
    "text-[10px] font-bold uppercase tracking-tight text-slate-800 dark:text-slate-200 opacity-60 mt-1.5 ml-1";

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* SECTION 1: BASIC PRODUCT DETAILS */}
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
              onChange={(val: string) => update({ brandId: val })}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Product / Model *</label>
            <ProductSelect
              value={data.productId}
              brandId={data.brandId}
              disabled={!data.brandId}
              onChange={(val: string) => update({ productId: val })}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>IMEI / Model number</label>
            <input
              value={data.imei}
              onChange={(e) => update({ imei: e.target.value })}
              placeholder="e.g. 354688110984156"
              className={inputClasses}
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
                    update({ category: "" }); // Reset to allow typing
                  } else {
                    setShowOtherCategory(false);
                    update({ category: val });
                  }
                }}
                className={cn(
                  inputClasses,
                  "appearance-none cursor-pointer pr-10",
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

      {/* SECTION 2: PURCHASE DETAILS */}
      <section className="p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600">
            <ShoppingCart size={16} strokeWidth={3} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 whitespace-nowrap">
            02. Purchase Details
          </h3>
          <div className="h-px w-full bg-linear-to-r from-blue-100 to-transparent dark:from-gray-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Purchase date *</label>
            <div className="relative">
              <input
                type="date"
                value={data.purchaseDate}
                onChange={(e) => update({ purchaseDate: e.target.value })}
                className={cn(inputClasses, "pr-12")}
              />
              <Calendar
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Warranty period</label>
            <div className="relative">
              <select
                value={data.warrantyPeriod}
                onChange={(e) => update({ warrantyPeriod: e.target.value })}
                className={cn(
                  inputClasses,
                  "appearance-none cursor-pointer pr-10",
                )}
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Expiry (Calculated)</label>
            <div className="relative">
              <input
                readOnly
                value={data.expiryDate || "Calculating..."}
                className={cn(
                  inputClasses,
                  "pr-12 bg-gray-50/50 dark:bg-gray-800/50 cursor-not-allowed opacity-80",
                )}
              />
              <CalendarCheck
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 opacity-60"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Price (USD)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => update({ price: e.target.value })}
                placeholder="0.00"
                className={cn(inputClasses, "pl-12")}
              />
              <DollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Retailer</label>
            <input
              value={data.retailer}
              onChange={(e) => update({ retailer: e.target.value })}
              placeholder="e.g. Amazon"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Invoice Number</label>
            <div className="relative">
              <input
                value={data.invoiceNumber}
                onChange={(e) => update({ invoiceNumber: e.target.value })}
                placeholder="INV-2024-001"
                className={cn(inputClasses, "pl-12")}
              />
              <Hash
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>

          <LocationRoot values={locationValues} onChange={handleLocationChange}>
            <CountryField label="Country *" className="lg:col-span-1" />
          </LocationRoot>
        </div>
      </section>

      {/* SECTION 3: CONDITION */}
      <section className="space-y-5 p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <label className={labelClasses}>
          Product condition at registration
        </label>
        <div className="flex flex-wrap gap-3">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update({ condition: c })}
              className={cn(
                "group relative px-8 py-4 rounded-2xl text-[13px] font-black tracking-tight transition-all border active:scale-95 flex items-center gap-3 overflow-hidden",
                data.condition === c
                  ? "bg-gray-900 text-white border-gray-900 shadow-xl dark:bg-blue-600 dark:border-blue-600"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400",
              )}
            >
              {data.condition === c && (
                <CheckCircle2
                  size={16}
                  className="text-blue-400 dark:text-white animate-in zoom-in-50"
                />
              )}
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={
            !data.brandId ||
            !data.productId ||
            !data.serialNumber ||
            !data.purchaseDate ||
            !data.category ||
            !data.country
          }
          className="group flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-[20px] font-black text-xs tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
        >
          CONTINUE TO UPLOAD
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
