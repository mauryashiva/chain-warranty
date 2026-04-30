"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Calendar,
  ChevronDown,
  CalendarCheck,
  DollarSign,
  Hash,
  CheckCircle2,
  Search,
} from "lucide-react";
import LocationRoot, {
  CountryField,
} from "@/components/common/Form/LocationSelector"
import { CURRENCIES } from "@/components/common/currencies";
import { useCurrencyConverter } from "@/hooks/common/use-currency-converter";
import { AlertTriangle } from "lucide-react";

const PERIODS = [
  "1 year",
  "2 years",
  "3 years",
  "5 years",
  "Other",
];

const CONDITIONS = ["New", "Open box", "Refurbished", "Pre-owned"];

export default function PurchaseDetails({
  data,
  update,
  updateWithValidation,
  errors,
  selectedProduct,
  inputClasses,
  labelClasses,
}: any) {
  const { checkPriceBounds, loading: currencyLoading } = useCurrencyConverter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                disabled={!!selectedProduct?.warrantyPeriod}
                className={cn(
                  inputClasses,
                  "appearance-none cursor-pointer pr-10",
                  !!selectedProduct?.warrantyPeriod && "bg-slate-100 dark:bg-gray-900 cursor-not-allowed opacity-80"
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

          {/* FIXED PURCHASE PRICE FIELD */}
          <div className="space-y-1">
            <label className={labelClasses}>Purchase Price</label>
            <div className={cn(inputClasses, "flex items-center p-0 overflow-visible")}>
              <div className="relative h-full shrink-0 border-r border-gray-200 dark:border-gray-700" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between h-full px-4 min-w-[110px] gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-l-xl"
                >
                  <span className="text-[13px] font-black text-gray-900 dark:text-white uppercase">
                    {data.currency || "USD"} ({CURRENCIES.find(c => c.code === (data.currency || "USD"))?.symbol || "$"})
                  </span>
                  <ChevronDown className={cn("text-gray-400 transition-transform", isOpen && "rotate-180")} size={14} />
                </button>

                {isOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          type="text"
                          autoFocus
                          placeholder="Search currency..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-bold outline-none border border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {filteredCurrencies.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => {
                            update({ currency: c.code });
                            setIsOpen(false);
                            setSearchTerm("");
                          }}
                          className={cn(
                            "px-4 py-3 text-[11px] font-black flex items-center justify-between cursor-pointer transition-all",
                            "hover:bg-blue-600 hover:text-white", 
                            (data.currency || "USD") === c.code 
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-600/20" 
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <span className="truncate">{c.code} — {c.name}</span>
                          <span className="ml-2 opacity-60 text-[10px]">{c.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <input
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => update({ price: e.target.value })}
                placeholder="0.00"
                className="flex-1 h-full px-4 bg-transparent text-[13px] font-black outline-none border-none focus:ring-0"
              />
            </div>
            
            {data.price && data.currency && selectedProduct?.priceMin && selectedProduct?.priceMax && (
              (() => {
                const status = checkPriceBounds(
                  parseFloat(data.price),
                  data.currency,
                  parseFloat(selectedProduct.priceMin),
                  parseFloat(selectedProduct.priceMax)
                );
                
                if (status === "OUT_OF_BOUNDS") {
                  return (
                    <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-500 text-[10px] font-bold leading-tight animate-in fade-in">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <p>This price is outside typical retail bounds. You may proceed, but claims may require manual receipt verification.</p>
                    </div>
                  );
                }
                return null;
              })()
            )}
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

      <section className="space-y-5 p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-6">
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