"use client";

import { useRef, useState, useMemo } from "react";
import {
  Store,
  ShieldCheck,
  Mail,
  MapPin,
  Loader2,
  ChevronDown,
  Globe,
  Lock,
  Link as LinkIcon,
  FileText,
  CreditCard,
  CheckCircle2,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { countryOptions, CountryOption } from "@/components/common/countries";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";

interface AddRetailerFormProps {
  onSave: (data: any) => Promise<void>;
}

export default function AddRetailerForm({ onSave }: AddRetailerFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [allLocationData, setAllLocationData] = useState<any[]>([]);
  const [isLoadingJson, setIsLoadingJson] = useState(false);

  // Brand Authorization State
  const { brands, isLoading: isLoadingBrands } = useAdminBrands();
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);

  // Phone Selection
  const [selectedPhoneCountry, setSelectedPhoneCountry] =
    useState<CountryOption>(
      countryOptions.find((c) => c.iso === "in") || countryOptions[0],
    );

  // Geographic State
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  // Dropdown UI State
  const [openDropdown, setOpenDropdown] = useState<
    "phone" | "country" | "state" | "city" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const formContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside(formContainerRef, () => {
    setOpenDropdown(null);
    setSearchQuery("");
  });

  const loadLocationData = async () => {
    if (allLocationData.length > 0) return;
    setIsLoadingJson(true);
    try {
      const data =
        await import("@/components/common/countries+states+cities.json");
      setAllLocationData(data.default as any[]);
    } catch (error) {
      console.error("Failed to load location data", error);
    } finally {
      setIsLoadingJson(false);
    }
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (openDropdown === "phone") {
      return countryOptions.filter(
        (c) => c.country.toLowerCase().includes(q) || c.code.includes(q),
      );
    }
    if (openDropdown === "country") {
      return allLocationData.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (openDropdown === "state" && selectedCountry) {
      return selectedCountry.states.filter((s: any) =>
        s.name.toLowerCase().includes(q),
      );
    }
    if (openDropdown === "city" && selectedState) {
      return selectedState.cities.filter((c: any) =>
        c.name.toLowerCase().includes(q),
      );
    }
    return [];
  }, [
    searchQuery,
    openDropdown,
    allLocationData,
    selectedCountry,
    selectedState,
  ]);

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
      contactPhone: `${selectedPhoneCountry.code} ${data.rawPhone}`,
      country: selectedCountry?.name || "India",
      state: selectedState?.name,
      city: selectedCity?.name,
      brandIds: selectedBrandIds,
    };

    delete (finalData as any).rawPhone;

    setIsSaving(true);
    try {
      await onSave(finalData);
      (e.target as HTMLFormElement).reset();
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setSelectedBrandIds([]);
    } finally {
      setIsSaving(false);
    }
  };

  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 mb-2 block ml-1";
  const inputClasses =
    "w-full px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-gray-800 border-none text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all appearance-none flex items-center justify-between";

  return (
    <div
      className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-[3rem] p-10 shadow-xl"
      ref={formContainerRef}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <Store size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            Add New Retailer
          </h2>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            Global partner onboarding system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <div className="space-y-1">
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
                className={cn(inputClasses, "cursor-pointer")}
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

          {/* Contact Phone */}
          <div className="space-y-1 relative">
            <label className={labelClasses}>Contact phone</label>
            <div className="relative flex items-center group">
              <div
                onClick={() =>
                  setOpenDropdown(openDropdown === "phone" ? null : "phone")
                }
                className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center z-20 pl-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-700 py-1.5 rounded-lg transition-colors"
              >
                <img
                  src={`https://flagcdn.com/w40/${selectedPhoneCountry.iso}.png`}
                  className="w-4 h-2.5 object-cover rounded-sm mr-1.5"
                  alt=""
                />
                <span className="text-[11px] font-black text-slate-700 dark:text-gray-300">
                  {selectedPhoneCountry.code}
                </span>
                <ChevronDown
                  size={12}
                  className={cn(
                    "ml-1 text-slate-400 transition-transform",
                    openDropdown === "phone" && "rotate-180",
                  )}
                />
              </div>
              <input
                name="rawPhone"
                type="tel"
                placeholder="98765 43210"
                className={cn(inputClasses, "pl-28 cursor-text")}
              />
              {openDropdown === "phone" && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2 border-b border-slate-50 dark:border-gray-800">
                    <input
                      autoFocus
                      placeholder="Search code..."
                      className="w-full bg-slate-50 dark:bg-gray-800/50 border-none rounded-lg py-2 px-3 text-[10px] font-bold outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto p-1">
                    {filteredItems.map((c: any) => (
                      <button
                        key={c.iso}
                        type="button"
                        onClick={() => {
                          setSelectedPhoneCountry(c);
                          setOpenDropdown(null);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 text-[10px] font-bold text-slate-800 dark:text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://flagcdn.com/w40/${c.iso}.png`}
                            className="w-4 h-2.5 object-cover rounded-sm"
                            alt=""
                          />
                          <span className="truncate max-w-25">{c.country}</span>
                        </div>
                        <span className="text-slate-400">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

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

          {/* Compliance & Tax */}
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

          {/* Geographic Selectors */}
          <div className="space-y-1 relative">
            <label className={labelClasses}>Country *</label>
            <div
              onClick={() => {
                loadLocationData();
                setOpenDropdown("country");
              }}
              className={inputClasses}
            >
              <div className="flex items-center gap-2 truncate">
                {selectedCountry ? (
                  <img
                    src={`https://flagcdn.com/w40/${selectedCountry.iso2.toLowerCase()}.png`}
                    className="w-4 h-2.5 object-cover rounded-sm"
                    alt=""
                  />
                ) : (
                  <Globe size={16} className="text-slate-400" />
                )}
                <span className={cn(!selectedCountry && "text-slate-400")}>
                  {selectedCountry?.name || "Select Country"}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={cn(
                  "text-slate-400 transition-transform",
                  openDropdown === "country" && "rotate-180",
                )}
              />
            </div>
            {openDropdown === "country" && !isLoadingJson && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-2 border-b border-slate-50 dark:border-gray-800">
                  <input
                    autoFocus
                    placeholder="Search country..."
                    className="w-full bg-slate-50 dark:bg-gray-800/50 border-none rounded-lg py-2 px-3 text-[10px] font-bold outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {filteredItems.map((c: any) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(c);
                        setSelectedState(null);
                        setSelectedCity(null);
                        setOpenDropdown(null);
                        setSearchQuery("");
                      }}
                      className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 text-[10px] font-bold text-left flex items-center gap-3 text-slate-800 dark:text-slate-200"
                    >
                      <img
                        src={`https://flagcdn.com/w40/${c.iso2.toLowerCase()}.png`}
                        className="w-4 h-2.5 object-cover rounded-sm shrink-0"
                        alt=""
                      />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 relative">
            <label className={labelClasses}>State / Province *</label>
            <div
              onClick={() => {
                if (selectedCountry) setOpenDropdown("state");
              }}
              className={cn(
                inputClasses,
                !selectedCountry && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin size={16} className="text-slate-400" />
                <span>{selectedState?.name || "Select State"}</span>
              </div>
              <ChevronDown
                size={14}
                className={cn(
                  "text-slate-400 transition-transform",
                  openDropdown === "state" && "rotate-180",
                )}
              />
            </div>
            {openDropdown === "state" && selectedCountry && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-2 border-b border-slate-50 dark:border-gray-800">
                  <input
                    autoFocus
                    placeholder="Search state..."
                    className="w-full bg-slate-50 dark:bg-gray-800/50 border-none rounded-lg py-2 px-3 text-[10px] font-bold outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {filteredItems.map((s: any) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedState(s);
                        setSelectedCity(null);
                        setOpenDropdown(null);
                        setSearchQuery("");
                      }}
                      className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 text-[10px] font-bold text-left text-slate-800 dark:text-slate-200"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 relative">
            <label className={labelClasses}>City *</label>
            <div
              onClick={() => {
                if (selectedState) setOpenDropdown("city");
              }}
              className={cn(
                inputClasses,
                !selectedState && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin size={16} className="text-slate-400" />
                <span>{selectedCity?.name || "Select City"}</span>
              </div>
              <ChevronDown
                size={14}
                className={cn(
                  "text-slate-400 transition-transform",
                  openDropdown === "city" && "rotate-180",
                )}
              />
            </div>
            {openDropdown === "city" && selectedState && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-2 border-b border-slate-50 dark:border-gray-800">
                  <input
                    autoFocus
                    placeholder="Search city..."
                    className="w-full bg-slate-50 dark:bg-gray-800/50 border-none rounded-lg py-2 px-3 text-[10px] font-bold outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {filteredItems.map((city: any) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        setSelectedCity(city);
                        setOpenDropdown(null);
                        setSearchQuery("");
                      }}
                      className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 text-[10px] font-bold text-left text-slate-800 dark:text-slate-200"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Address */}
          <div className="md:col-span-2 space-y-1">
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
                  "pl-12 pt-3.5 h-13 resize-none cursor-text",
                )}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>PIN / Zip Code</label>
            <div className="relative">
              {!selectedCity && (
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
                  size={14}
                />
              )}
              <input
                name="pinCode"
                placeholder={selectedCity ? "e.g. 400001" : "Select city first"}
                disabled={!selectedCity}
                className={cn(
                  inputClasses,
                  "cursor-text",
                  !selectedCity &&
                    "pl-10 opacity-50 cursor-not-allowed grayscale",
                )}
              />
            </div>
          </div>
        </div>

        {/* Brand Authorization */}
        <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Tags size={16} className="text-blue-600" />
            <label className={labelClasses + " mb-0"}>
              Brand Authorization *
            </label>
          </div>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest -mt-2 ml-7">
            Select brands this retailer is authorized to distribute
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {isLoadingBrands ? (
              <div className="col-span-full py-4 flex items-center justify-center gap-2 text-slate-400 font-black uppercase text-[10px]">
                <Loader2 className="animate-spin text-blue-600" size={14} />{" "}
                Fetching Catalog...
              </div>
            ) : (
              brands.map((brand: any) => {
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
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0",
                        isSelected
                          ? "bg-white text-blue-600"
                          : "bg-white dark:bg-gray-900 text-slate-400 group-hover:text-blue-600",
                      )}
                    >
                      {brand.name[0]}
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
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-50 dark:border-gray-800">
          <button
            type="submit"
            disabled={isSaving || selectedBrandIds.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="animate-spin" size={14} />} Save
            retailer
          </button>
          {selectedBrandIds.length === 0 && !isLoadingBrands && (
            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">
              Authorize at least one brand
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
