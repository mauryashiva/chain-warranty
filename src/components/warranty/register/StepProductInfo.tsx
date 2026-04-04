"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Calendar,
  DollarSign,
  Globe,
  ArrowRight,
  Edit3,
  Clock,
  Package,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";

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
const COUNTRIES = ["India", "USA", "UAE", "UK", "Singapore", "Other"];

export default function StepProductInfo({ data, update, onNext }: any) {
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [isOtherPeriod, setIsOtherPeriod] = useState(false);
  const [isOtherCountry, setIsOtherCountry] = useState(false);

  useEffect(() => {
    const isManualCat =
      data.category &&
      !CATEGORIES.filter((c) => c !== "Other electronics").includes(
        data.category,
      );
    setIsOtherCategory(data.category === "Other electronics" || isManualCat);

    const isManualPeriod =
      data.warrantyPeriod &&
      !PERIODS.filter((p) => p !== "Other").includes(data.warrantyPeriod);
    setIsOtherPeriod(data.warrantyPeriod === "Other" || isManualPeriod);

    const isManualCountry =
      data.country &&
      !COUNTRIES.filter((c) => c !== "Other").includes(data.country);
    setIsOtherCountry(data.country === "Other" || isManualCountry);
  }, [data.category, data.warrantyPeriod, data.country]);

  const inputClasses =
    "w-full px-5 py-4 rounded-xl border border-gray-200 bg-white text-sm font-medium outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:border-blue-500";

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2.5 block ml-1";

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
          <div className="h-px w-full bg-gradient-to-r from-blue-100 to-transparent dark:from-gray-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Product name *</label>
            <input
              value={data.productName}
              onChange={(e) => update({ ...data, productName: e.target.value })}
              placeholder="e.g. Sony WH-1000XM5"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Brand *</label>
            <input
              value={data.brand}
              onChange={(e) => update({ ...data, brand: e.target.value })}
              placeholder="e.g. Sony"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Serial number *</label>
            <input
              value={data.serialNumber}
              onChange={(e) =>
                update({ ...data, serialNumber: e.target.value })
              }
              placeholder="e.g. SN-2024-XXXXX"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>IMEI / Model number</label>
            <input
              value={data.imei}
              onChange={(e) => update({ ...data, imei: e.target.value })}
              placeholder="e.g. 354688110984156"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1 md:col-span-1">
            <label className={labelClasses}>Category *</label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <select
                  value={isOtherCategory ? "Other electronics" : data.category}
                  onChange={(e) =>
                    update({ ...data, category: e.target.value })
                  }
                  className={cn(
                    inputClasses,
                    "appearance-none pr-12 cursor-pointer",
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
                  size={18}
                />
              </div>
              {isOtherCategory && (
                <div className="relative animate-in zoom-in-95 duration-300">
                  <input
                    autoFocus
                    value={
                      data.category === "Other electronics" ? "" : data.category
                    }
                    onChange={(e) =>
                      update({ ...data, category: e.target.value })
                    }
                    placeholder="Specify product type..."
                    className={cn(
                      inputClasses,
                      "pl-11 border-blue-200 bg-blue-50/30 dark:bg-blue-500/5 dark:border-blue-500/20",
                    )}
                  />
                  <Edit3
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                    size={16}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Color / Variant</label>
            <input
              value={data.color}
              onChange={(e) => update({ ...data, color: e.target.value })}
              placeholder="e.g. Midnight Black"
              className={inputClasses}
            />
          </div>
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
          <div className="h-px w-full bg-gradient-to-r from-blue-100 to-transparent dark:from-gray-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Purchase date *</label>
            <div className="relative">
              <input
                type="date"
                value={data.purchaseDate}
                onChange={(e) =>
                  update({ ...data, purchaseDate: e.target.value })
                }
                className={cn(inputClasses, "pr-12")}
              />
              <Calendar
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Warranty period</label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <select
                  value={isOtherPeriod ? "Other" : data.warrantyPeriod}
                  onChange={(e) =>
                    update({ ...data, warrantyPeriod: e.target.value })
                  }
                  className={cn(
                    inputClasses,
                    "appearance-none pr-12 cursor-pointer",
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
                  size={18}
                />
              </div>
              {isOtherPeriod && (
                <div className="relative animate-in zoom-in-95 duration-300">
                  <input
                    autoFocus
                    value={
                      data.warrantyPeriod === "Other" ? "" : data.warrantyPeriod
                    }
                    onChange={(e) =>
                      update({ ...data, warrantyPeriod: e.target.value })
                    }
                    placeholder="e.g. 6 Months"
                    className={cn(
                      inputClasses,
                      "pl-11 border-blue-200 bg-blue-50/30 dark:bg-blue-500/5 dark:border-blue-500/20",
                    )}
                  />
                  <Clock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                    size={16}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Price (USD)</label>
            <div className="relative">
              <input
                type="number"
                value={data.price}
                onChange={(e) => update({ ...data, price: e.target.value })}
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
              onChange={(e) => update({ ...data, retailer: e.target.value })}
              placeholder="e.g. Amazon"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Invoice number</label>
            <input
              value={data.invoiceNumber}
              onChange={(e) =>
                update({ ...data, invoiceNumber: e.target.value })
              }
              placeholder="e.g. INV-9923"
              className={inputClasses}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Country</label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <select
                  value={isOtherCountry ? "Other" : data.country}
                  onChange={(e) => update({ ...data, country: e.target.value })}
                  className={cn(
                    inputClasses,
                    "appearance-none pr-12 cursor-pointer",
                  )}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Globe
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
              {isOtherCountry && (
                <div className="relative animate-in zoom-in-95 duration-300">
                  <input
                    autoFocus
                    value={data.country === "Other" ? "" : data.country}
                    onChange={(e) =>
                      update({ ...data, country: e.target.value })
                    }
                    placeholder="Enter country..."
                    className={cn(
                      inputClasses,
                      "pl-11 border-blue-200 bg-blue-50/30 dark:bg-blue-500/5 dark:border-blue-500/20",
                    )}
                  />
                  <Edit3
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                    size={16}
                  />
                </div>
              )}
            </div>
          </div>
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
              onClick={() => update({ ...data, condition: c })}
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
          className="group flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-[20px] font-black text-xs tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.98]"
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
