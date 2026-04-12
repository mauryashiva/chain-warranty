"use client";

import { useRef, useState } from "react";
import {
  Store,
  ShieldCheck,
  Mail,
  MapPin,
  Loader2,
  ChevronDown,
  Lock,
  Link as LinkIcon,
  FileText,
  CreditCard,
  CheckCircle2,
  Tags,
  Briefcase,
  Contact,
  Globe,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { countryOptions } from "@/components/common/countries";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";
import { useClickOutside } from "@/hooks/use-click-outside";
// 🌍 Import Advanced Composable Components
import LocationRoot, {
  CountryField,
  PhoneField,
  StateField,
  CityField,
} from "@/components/common/Form/LocationSelector";

interface AddRetailerFormProps {
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function AddRetailerForm({
  onSave,
  onClose,
}: AddRetailerFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useClickOutside(formRef, () => {
    onClose();
  });

  const { brands, isLoading: isLoadingBrands } = useAdminBrands();
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);

  // 🌍 Composable Location State
  const [locationValues, setLocationValues] = useState({
    phoneCode: "+91",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
  });

  const handleLocationChange = (field: string, value: string) => {
    setLocationValues((prev) => ({ ...prev, [field]: value }));
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const finalData = {
      ...data,
      ...locationValues,
      contactPhone: `${locationValues.phoneCode} ${locationValues.phoneNumber}`,
      brandIds: selectedBrandIds,
    };

    delete (finalData as any).phoneNumber;
    delete (finalData as any).phoneCode;

    setIsSaving(true);
    try {
      await onSave(finalData);
      (e.target as HTMLFormElement).reset();
      setLocationValues({
        phoneCode: "+91",
        phoneNumber: "",
        country: "",
        state: "",
        city: "",
      });
      setSelectedBrandIds([]);
    } finally {
      setIsSaving(false);
    }
  };

  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 mb-2 block ml-1";
  const inputClasses =
    "w-full px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-gray-800 border-none text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all min-h-[46px]";
  const sectionHeaderClasses =
    "flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-gray-800";
  const sectionTitleClasses =
    "text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400";

  return (
    <div
      ref={formRef}
      className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-[3rem] p-10 shadow-2xl relative max-w-6xl mx-auto"
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 transition-colors"
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <Store size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            Add New Retailer
          </h2>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            Partner Management Interface
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* SECTION 1: IDENTITY & CONTACT */}
        <section>
          <div className={sectionHeaderClasses}>
            <Contact size={14} className="text-blue-600" />
            <h3 className={sectionTitleClasses}>Identity & Contact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 space-y-1">
              <label className={labelClasses}>Retailer name *</label>
              <input
                name="name"
                required
                placeholder="e.g. Digital Plaza"
                className={cn(inputClasses, "cursor-text")}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Retailer type *</label>
              <div className="relative">
                <select
                  name="type"
                  className={cn(
                    inputClasses,
                    "appearance-none cursor-pointer pr-10",
                  )}
                >
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="BOTH">Both</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Contact email *</label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  name="contactEmail"
                  type="email"
                  required
                  placeholder="contact@store.com"
                  className={cn(inputClasses, "pl-12 cursor-text")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: LOCATION & PRESENCE */}
        <section>
          <div className={sectionHeaderClasses}>
            <Globe size={14} className="text-blue-600" />
            <h3 className={sectionTitleClasses}>Location & Presence</h3>
          </div>

          <LocationRoot values={locationValues} onChange={handleLocationChange}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
              {/* Individual Fields now sit directly in the parent grid */}
              <PhoneField label="Contact Phone" className="md:col-span-1" />

              <CountryField label="Country" className="md:col-span-1" />

              <StateField label="State / Province" className="md:col-span-1" />

              <CityField label="City" className="md:col-span-1" />

              <div className="space-y-1">
                <label className={labelClasses}>PIN / Zip Code</label>
                <div className="relative">
                  {!locationValues.city && (
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
                      size={14}
                    />
                  )}
                  <input
                    name="pinCode"
                    placeholder={
                      locationValues.city ? "e.g. 400001" : "Select city first"
                    }
                    disabled={!locationValues.city}
                    className={cn(
                      inputClasses,
                      "cursor-text",
                      !locationValues.city &&
                        "pl-10 opacity-50 cursor-not-allowed grayscale",
                    )}
                  />
                </div>
              </div>

              <div className="lg:col-span-3 space-y-1">
                <label className={labelClasses}>Detailed Address *</label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4 text-slate-400"
                    size={16}
                  />
                  <textarea
                    name="address"
                    required
                    rows={1}
                    placeholder="Street, Building, Area info..."
                    className={cn(
                      inputClasses,
                      "pl-12 pt-3.5 h-11.5 resize-none cursor-text",
                    )}
                  />
                </div>
              </div>
            </div>
          </LocationRoot>
        </section>

        {/* SECTION 3: BUSINESS & TAX */}
        <section>
          <div className={sectionHeaderClasses}>
            <Briefcase size={14} className="text-blue-600" />
            <h3 className={sectionTitleClasses}>Business & Tax Info</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Official Website</label>
              <div className="relative">
                <LinkIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  name="website"
                  type="url"
                  placeholder="https://store.com"
                  className={cn(inputClasses, "pl-12 cursor-text")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>GST number *</label>
              <div className="relative">
                <ShieldCheck
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  name="gstNumber"
                  required
                  placeholder="GSTIN"
                  className={cn(
                    inputClasses,
                    "pl-12 uppercase font-mono cursor-text",
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>PAN Number</label>
              <div className="relative">
                <CreditCard
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  name="panNumber"
                  placeholder="ABCDE1234F"
                  className={cn(
                    inputClasses,
                    "pl-12 uppercase font-mono cursor-text",
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Tax ID</label>
              <div className="relative">
                <FileText
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  name="taxId"
                  placeholder="Internal Tax Identifier"
                  className={cn(inputClasses, "pl-12 cursor-text")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: BRAND AUTHORIZATION */}
        <section className="space-y-4 pt-4 border-t border-slate-50 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Tags size={16} className="text-blue-600" />
            <label className={labelClasses + " mb-0"}>
              Brand Authorization *
            </label>
          </div>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest -mt-2 ml-7">
            Grant distribution permissions
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {isLoadingBrands ? (
              <div className="col-span-full py-4 flex items-center justify-center gap-2 text-slate-400 font-black uppercase text-[10px]">
                <Loader2 className="animate-spin text-blue-600" size={14} />{" "}
                Fetching Catalog...
              </div>
            ) : (
              brands
                ?.filter((b: any) => b.status === "ACTIVE")
                .map((brand: any) => {
                  const isSelected = selectedBrandIds.includes(brand.id);
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => toggleBrand(brand.id)}
                      className={cn(
                        "group relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300",
                        isSelected
                          ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20"
                          : "bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-800 hover:border-blue-400",
                      )}
                    >
                      <div className="relative">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 overflow-hidden",
                            isSelected
                              ? "bg-white text-blue-600"
                              : "bg-white dark:bg-gray-900 text-slate-400 group-hover:text-blue-600",
                          )}
                        >
                          {brand.logoUrl ? (
                            <img
                              src={brand.logoUrl}
                              className="w-full h-full object-contain p-1"
                              alt=""
                            />
                          ) : (
                            brand.name[0]
                          )}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-tight truncate",
                          isSelected
                            ? "text-white"
                            : "text-slate-800 dark:text-slate-200",
                        )}
                      >
                        {brand.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2
                          size={12}
                          className="absolute -top-1.5 -right-1.5 text-blue-600 bg-white rounded-full border-2 border-white"
                        />
                      )}
                    </button>
                  );
                })
            )}
          </div>
        </section>

        <div className="pt-6 border-t border-slate-50 dark:border-gray-800">
          <button
            type="submit"
            disabled={isSaving || selectedBrandIds.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="animate-spin" size={14} />}
            Save Retailer Profile
          </button>
        </div>
      </form>
    </div>
  );
}
