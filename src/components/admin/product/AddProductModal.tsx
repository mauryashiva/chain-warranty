"use client";

import { useRef, useState } from "react";
import { X, Calendar, Settings, Loader2 } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import BrandSelect from "@/components/common/Form/BrandSelect";
// 🌍 Import the professional Composable Location Components
import LocationRoot, {
  CountryField,
} from "@/components/common/Form/LocationSelector";

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
  const [isSaving, setIsSaving] = useState(false);

  // States for interactive fields
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState("");
  const [warranty, setWarranty] = useState("1");
  const [identificationType, setIdentificationType] = useState("SERIAL");

  // 🌍 Location Selector State
  const [locationValues, setLocationValues] = useState({
    country: "",
  });

  const handleLocationChange = (field: string, value: string) => {
    setLocationValues((prev) => ({ ...prev, [field]: value }));
  };

  useClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 mb-2 block ml-1";

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 border-none text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all placeholder:text-slate-400 min-h-[46px]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (!selectedBrandId) {
      alert("Please select a brand");
      return;
    }

    if (category === "Other") data.category = data.customCategory;
    if (warranty === "Other") data.warrantyPeriod = data.customWarranty;

    data.brandId = selectedBrandId;
    data.currency = currency;
    data.identificationType = identificationType;
    data.status = "ACTIVE";
    // 🌍 Assign country from LocationSelector state
    data.manufactureCountry = locationValues.country;

    delete data.customCategory;
    delete data.customWarranty;

    setIsSaving(true);
    try {
      await onSave(data);
    } finally {
      setIsSaving(false);
    }
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
            <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              Add New Product Model
            </h2>
            <p className="text-[11px] font-bold text-slate-500 mt-1">
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
          className="p-10 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
            {/* Row 1 */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand *</label>
              <BrandSelect
                value={selectedBrandId}
                onChange={setSelectedBrandId}
              />
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
              <label className={labelClasses}>Identification type</label>
              <select
                name="identificationType"
                value={identificationType}
                onChange={(e) => setIdentificationType(e.target.value)}
                className={cn(inputClasses, "appearance-none cursor-pointer")}
              >
                <option value="SERIAL">Serial number only</option>
                <option value="SERIAL_IMEI">Serial + IMEI</option>
              </select>
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <label className={labelClasses}>SKU *</label>
              <input
                name="sku"
                placeholder="e.g. SONY-WH1XM5"
                required
                className={cn(inputClasses, "font-mono uppercase")}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Category *</label>
              <select
                name="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(inputClasses, "appearance-none cursor-pointer")}
              >
                <option value="">Select Category</option>
                <option value="Headphones / Audio">Headphones / Audio</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Other">Other</option>
              </select>
              {category === "Other" && (
                <input
                  name="customCategory"
                  placeholder="Type category..."
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

            {/* Row 3 */}
            <div className="space-y-1">
              <label className={labelClasses}>Warranty period (years) *</label>
              <select
                name="warrantyPeriod"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className={cn(inputClasses, "appearance-none cursor-pointer")}
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Base Price *</label>
              <div className="relative flex items-center">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="absolute left-3 bg-transparent text-[10px] font-black text-slate-500 outline-none appearance-none z-10"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
                <input
                  name="priceMin"
                  type="number"
                  placeholder="349.00"
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
                  className="absolute left-3 bg-transparent text-[10px] font-black text-slate-500 outline-none appearance-none z-10"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
                <input
                  name="priceMax"
                  type="number"
                  placeholder="399.00"
                  className={cn(inputClasses, "pl-14")}
                />
              </div>
            </div>

            {/* Row 4 */}
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

            {/* 🌍 Advanced Composable Location Selector */}
            <LocationRoot
              values={locationValues}
              onChange={handleLocationChange}
            >
              <CountryField
                label="Country of manufacture"
                className="md:col-span-1"
              />
            </LocationRoot>

            <div className="space-y-1">
              <label className={labelClasses}>HSN code (India)</label>
              <input
                name="hsnCode"
                placeholder="e.g. 85183000"
                className={inputClasses}
              />
            </div>

            {/* Row 5 */}
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
              <label className={labelClasses}>IMEI / serial regex</label>
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

            {/* Full Width Fields */}
            <div className="md:col-span-3 space-y-1">
              <label className={labelClasses}>Product description</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Short description..."
                className={cn(inputClasses, "resize-none h-auto")}
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className={labelClasses}>Warranty URL</label>
              <input
                name="termsUrl"
                placeholder="https://sony.com/warranty-terms"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-slate-50 pt-8">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="animate-spin" size={14} />} Save
              product
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
