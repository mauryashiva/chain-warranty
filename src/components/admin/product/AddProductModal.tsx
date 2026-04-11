"use client";

import { useRef, useState } from "react";
import { X, Calendar, Settings, Loader2 } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";
import { cn } from "@/lib/utils";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSave,
}: AddProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { brands } = useAdminBrands();
  const [isSaving, setIsSaving] = useState(false);

  // States for interactive fields
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState("");
  const [warranty, setWarranty] = useState("1");

  useClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  // Updated to slate-800 for light and slate-200 for dark
  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 mb-2 block ml-1";

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 border-none text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all placeholder:text-slate-400";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    // Override with custom user inputs if "Other" is selected
    if (category === "Other") {
      data.category = data.customCategory;
    }
    if (warranty === "Other") {
      data.warrantyPeriod = data.customWarranty;
    }

    // Attach selected currency
    data.currency = currency;

    // Clean up temporary object keys before saving
    delete data.customCategory;
    delete data.customWarranty;

    setIsSaving(true);
    await onSave(data);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              Add New Product Model
            </h2>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Initialize a new asset specification in the global registry.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-8 overflow-y-auto max-h-[75vh]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Brand *</label>
              <select
                name="brandId"
                required
                className={cn(inputClasses, "appearance-none")}
              >
                <option value="">Select brand</option>
                {brands?.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Product name *</label>
              <input
                name="name"
                placeholder="e.g. WH-1000XM5"
                required
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Model number *</label>
              <input
                name="modelNumber"
                placeholder="e.g. WH1000XM5"
                required
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>SKU *</label>
              <input
                name="sku"
                placeholder="e.g. SONY-WH1XM5"
                required
                className={cn(inputClasses, "font-mono uppercase")}
              />
            </div>

            {/* Category Dropdown with "Other" condition */}
            <div className="space-y-1">
              <label className={labelClasses}>Category *</label>
              <select
                name="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(inputClasses, "appearance-none")}
              >
                <option value="">Select Category</option>
                <option value="Headphones / Audio">Headphones / Audio</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Smart TV">Smart TV</option>
                <option value="Tablet">Tablet</option>
                <option value="Camera">Camera</option>
                <option value="Wearable">Wearable</option>
                <option value="Other">Other</option>
              </select>
              {category === "Other" && (
                <input
                  name="customCategory"
                  placeholder="Type custom category..."
                  required
                  autoFocus
                  className={cn(inputClasses, "mt-2")}
                />
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Sub-category</label>
              <input
                name="subCategory"
                placeholder="e.g. Over-ear, TWS"
                className={inputClasses}
              />
            </div>

            {/* Warranty Dropdown with "Other" condition */}
            <div className="space-y-1">
              <label className={labelClasses}>Warranty period (years) *</label>
              <select
                name="warrantyPeriod"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className={cn(inputClasses, "appearance-none")}
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="Other">Other</option>
              </select>
              {warranty === "Other" && (
                <input
                  name="customWarranty"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Enter exact years (e.g. 1.5)"
                  required
                  autoFocus
                  className={cn(inputClasses, "mt-2")}
                />
              )}
            </div>

            {/* Minimum Price with Currency Selector */}
            <div className="space-y-1">
              <label className={labelClasses}>Base Price *</label>
              <div className="relative flex items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="absolute left-3 bg-transparent text-xs font-black text-slate-500 outline-none cursor-pointer appearance-none z-10"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
                <input
                  name="priceMin"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="349.00"
                  required
                  className={cn(inputClasses, "pl-14")}
                />
              </div>
            </div>

            {/* Maximum Price with Currency Selector */}
            <div className="space-y-1">
              <label className={labelClasses}>Max Price Range</label>
              <div className="relative flex items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="absolute left-3 bg-transparent text-xs font-black text-slate-500 outline-none cursor-pointer appearance-none z-10"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
                <input
                  name="priceMax"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="399.00"
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
                  className={cn(inputClasses, "pl-10")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Country of manufacture</label>
              <input
                name="manufactureCountry"
                placeholder="e.g. China"
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>HSN code (India)</label>
              <input
                name="hsnCode"
                placeholder="e.g. 85183000"
                className={inputClasses}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className={labelClasses}>
                Available colors / variants
              </label>
              <input
                name="variants"
                placeholder="Midnight Black, Silver (comma separated)"
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>IMEI / serial format regex</label>
              <div className="relative">
                <Settings
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  name="serialRegex"
                  placeholder="^SN-[0-9]{4}..."
                  className={cn(inputClasses, "pl-10 font-mono")}
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className={labelClasses}>Product description</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Short description for warranty card..."
                className={cn(inputClasses, "resize-none")}
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className={labelClasses}>
                Warranty terms & conditions URL
              </label>
              <input
                name="termsUrl"
                placeholder="https://sony.com/warranty-terms"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="animate-spin" size={14} />}
              Save product
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
