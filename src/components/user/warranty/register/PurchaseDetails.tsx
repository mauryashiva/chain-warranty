"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Calendar,
  ChevronDown,
  CalendarCheck,
  DollarSign,
  Hash,
  CheckCircle2,
} from "lucide-react";
import LocationRoot, {
  CountryField,
} from "@/components/common/Form/LocationSelector";

const PERIODS = [
  "1 year",
  "2 years",
  "3 years",
  "5 years",
  "Lifetime",
  "Other",
];

const CONDITIONS = ["New", "Open box", "Refurbished", "Pre-owned"];

export default function PurchaseDetails({
  data,
  update,
  updateWithValidation,
  errors,
  inputClasses,
  labelClasses,
}: any) {
  const locationValues = {
    country: data.country || "",
  };

  const handleLocationChange = (field: string, value: string) => {
    update({ [field]: value });
  };

  return (
    <>
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
                onChange={(e) =>
                  updateWithValidation({ purchaseDate: e.target.value })
                }
                className={cn(
                  inputClasses,
                  "pr-12",
                  errors.purchaseDate
                    ? "border-red-500 focus:border-red-500 focus:ring-red-600/5"
                    : "",
                )}
              />
              <Calendar
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            {errors.purchaseDate && (
              <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
                ❌ {errors.purchaseDate}
              </p>
            )}
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

          <LocationRoot
            values={locationValues}
            onChange={(field: string, value: string) => {
              handleLocationChange(field, value);
              updateWithValidation({ [field]: value });
            }}
          >
            <div className="space-y-1 lg:col-span-1">
              <CountryField label="Country *" />
              {errors.country && (
                <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
                  ❌ {errors.country}
                </p>
              )}
            </div>
          </LocationRoot>
        </div>
      </section>

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
    </>
  );
}