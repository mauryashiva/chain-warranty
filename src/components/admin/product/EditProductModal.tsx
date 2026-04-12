"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  X,
  Calendar,
  Settings,
  Loader2,
  Globe,
  ChevronDown,
  Search,
  Lock,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { countryOptions, CountryOption } from "@/components/common/countries";
import ProductStatusToggle from "./ProductStatusToggle";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void>;
  product: any;
}

export default function EditProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: EditProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "DISCONTINUED">(
    "ACTIVE",
  );
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState("");
  const [warranty, setWarranty] = useState("1");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null,
  );
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  useEffect(() => {
    if (product && isOpen) {
      setStatus(product.status || "ACTIVE");
      setCurrency(product.currency || "USD");
      setCategory(product.category || "");
      setWarranty(product.warrantyPeriod || "1");

      if (product.manufactureCountry) {
        const found = countryOptions.find(
          (c) => c.country === product.manufactureCountry,
        );
        if (found) setSelectedCountry(found);
      }
    }
  }, [product, isOpen]);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.toLowerCase();
    return countryOptions.filter((c) => c.country.toLowerCase().includes(q));
  }, [countrySearch]);

  useClickOutside(modalRef, onClose);
  useClickOutside(countryDropdownRef, () => setIsCountryOpen(false));

  if (!isOpen || !product) return null;

  // Optimized Secondary Text Colors: slate-800 (Light) / slate-200 (Dark)
  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 mb-2 block ml-1";
  const secondaryDescClasses =
    "text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight";

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 border-none text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all placeholder:text-slate-400";
  const lockedClasses =
    "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800/40 border border-slate-100 dark:border-gray-800 text-xs font-bold text-slate-500 flex items-center gap-3 italic cursor-not-allowed";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    let finalCategory = data.category;
    if (category === "Other") finalCategory = data.customCategory;

    let finalWarranty = data.warrantyPeriod;
    if (warranty === "Other") finalWarranty = data.customWarranty;

    const finalData: any = {
      ...data,
      category: finalCategory,
      warrantyPeriod: finalWarranty,
      status,
      currency,
      manufactureCountry:
        selectedCountry?.country || product.manufactureCountry,
    };

    delete finalData.customCategory;
    delete finalData.customWarranty;

    setIsSaving(true);
    try {
      await onSave(product.id, finalData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              Edit Product Specification
            </h2>
            <p className={cn(secondaryDescClasses, "mt-1")}>
              Registry Update Protocol — Asset ID:{" "}
              {product.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={3} className="text-slate-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-10 overflow-y-auto max-h-[75vh] custom-scrollbar"
        >
          {/* Status Section */}
          <div className="mb-10 p-6 bg-slate-50/50 dark:bg-gray-800/30 rounded-3xl border border-slate-100 dark:border-gray-800 flex items-center justify-between">
            <div className="space-y-1">
              <label className={labelClasses}>Lifecycle Status</label>
              <p className={secondaryDescClasses}>
                Current market availability status
              </p>
            </div>
            <ProductStatusToggle value={status} onChange={setStatus} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
            {/* Locked Identity Row */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand (Locked)</label>
              <div className={lockedClasses}>
                <Lock size={12} /> {product.brand?.name || "Global Brand"}
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Model Number (Locked)</label>
              <div className={lockedClasses}>
                <Lock size={12} /> {product.modelNumber}
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>SKU Identifier (Locked)</label>
              <div className={lockedClasses}>
                <Lock size={12} /> {product.sku}
              </div>
            </div>

            {/* Editable Information */}
            <div className="space-y-1">
              <label className={labelClasses}>Product name *</label>
              <input
                name="name"
                defaultValue={product.name}
                required
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Category *</label>
              <div className="relative">
                <select
                  name="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(
                    inputClasses,
                    "appearance-none cursor-pointer pr-10",
                  )}
                >
                  <option value="Headphones / Audio">Headphones / Audio</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Smart TV">Smart TV</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {category === "Other" && (
                <input
                  name="customCategory"
                  defaultValue={product.category}
                  required
                  className={cn(inputClasses, "mt-2")}
                />
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Sub-category</label>
              <input
                name="subCategory"
                defaultValue={product.subCategory}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Warranty period (years) *</label>
              <div className="relative">
                <select
                  name="warrantyPeriod"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className={cn(
                    inputClasses,
                    "appearance-none cursor-pointer pr-10",
                  )}
                >
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Base Price *</label>
              <div className="relative flex items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="absolute left-3 bg-transparent text-[10px] font-black text-slate-500 appearance-none z-10 outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
                <input
                  name="priceMin"
                  type="number"
                  step="0.01"
                  defaultValue={product.priceMin}
                  required
                  className={cn(inputClasses, "pl-14")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Max Price Range</label>
              <div className="relative flex items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="absolute left-3 bg-transparent text-[10px] font-black text-slate-500 appearance-none z-10 outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
                <input
                  name="priceMax"
                  type="number"
                  step="0.01"
                  defaultValue={product.priceMax}
                  className={cn(inputClasses, "pl-14")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Launch date</label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  name="launchDate"
                  type="date"
                  defaultValue={
                    product.launchDate
                      ? new Date(product.launchDate).toISOString().split("T")[0]
                      : ""
                  }
                  className={cn(inputClasses, "pl-10")}
                />
              </div>
            </div>

            {/* Country Selector - Aligned with Row 4 */}
            <div className="space-y-1 relative" ref={countryDropdownRef}>
              <label className={labelClasses}>Country of manufacture</label>
              <div
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className={cn(
                  inputClasses,
                  "flex items-center justify-between cursor-pointer",
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {selectedCountry ? (
                    <img
                      src={`https://flagcdn.com/w40/${selectedCountry.iso}.png`}
                      className="w-4 h-2.5 object-cover rounded-sm"
                      alt=""
                    />
                  ) : (
                    <Globe size={14} className="text-slate-400" />
                  )}
                  <span className={cn(!selectedCountry && "text-slate-400")}>
                    {selectedCountry?.country || "Select country"}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-slate-400 transition-transform",
                    isCountryOpen && "rotate-180",
                  )}
                />
              </div>
              {isCountryOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-2 border-b border-slate-50 dark:border-gray-800">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={12}
                      />
                      <input
                        autoFocus
                        placeholder="Search..."
                        className="w-full bg-slate-50 dark:bg-gray-800/50 border-none rounded-lg py-2 pl-9 pr-4 text-[10px] font-bold outline-none"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
                    {filteredCountries.map((c) => (
                      <button
                        key={c.iso}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <img
                          src={`https://flagcdn.com/w40/${c.iso}.png`}
                          className="w-4 h-2.5 object-cover rounded-sm"
                          alt=""
                        />
                        {c.country}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>HSN code (India)</label>
              <input
                name="hsnCode"
                defaultValue={product.hsnCode}
                className={inputClasses}
              />
            </div>

            {/* Extended Row */}
            <div className="md:col-span-2 space-y-1">
              <label className={labelClasses}>Available variants</label>
              <input
                name="variants"
                defaultValue={product.variants}
                placeholder="Colors, Sizes (comma separated)"
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Serial format regex</label>
              <div className="relative">
                <Settings
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  name="serialRegex"
                  defaultValue={product.serialRegex}
                  className={cn(inputClasses, "pl-10 font-mono")}
                />
              </div>
            </div>

            {/* Textarea Area */}
            <div className="md:col-span-3 space-y-1">
              <label className={labelClasses}>Product description</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={product.description}
                className={cn(inputClasses, "resize-none h-auto")}
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className={labelClasses}>Warranty terms URL</label>
              <input
                name="termsUrl"
                defaultValue={product.termsUrl}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 flex items-center gap-4 border-t border-slate-100 dark:border-gray-800 pt-10">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSaving && <Loader2 className="animate-spin" size={14} />}
              Update Product
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
