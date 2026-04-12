"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  X,
  Store,
  Mail,
  MapPin,
  Globe,
  Lock,
  Link as LinkIcon,
  CreditCard,
  ShieldCheck,
  Tags,
  CheckCircle2,
  Loader2,
  Save,
  ChevronDown,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";
import { countryOptions, CountryOption } from "@/components/common/countries";
import { cn } from "@/lib/utils";
import RetailerStatusBadge, { RetailerStatus } from "./RetailerStatusBadge";

interface EditRetailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  retailer: any;
  onSave: (id: string, data: any) => Promise<void>;
}

export default function EditRetailerModal({
  isOpen,
  onClose,
  retailer,
  onSave,
}: EditRetailerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { brands } = useAdminBrands();

  // Form States
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [status, setStatus] = useState<RetailerStatus>("ACTIVE");

  // Location Data States
  const [allLocationData, setAllLocationData] = useState<any[]>([]);
  const [isLoadingJson, setIsLoadingJson] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<
    "phone" | "country" | "state" | "city" | null
  >(null);

  // Phone State
  const [selectedPhoneCountry, setSelectedPhoneCountry] =
    useState<CountryOption>(
      countryOptions.find((c) => c.iso === "in") || countryOptions[0],
    );

  useClickOutside(modalRef, () => {
    setOpenDropdown(null);
    setSearchQuery("");
    onClose();
  });

  // Load Location JSON
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

  // Sync Initial Data
  useEffect(() => {
    if (retailer && isOpen) {
      setSelectedBrandIds(
        retailer.brandIds || retailer.brands?.map((b: any) => b.id) || [],
      );
      setStatus(retailer.status || "ACTIVE");

      // Parse phone if exists (Format: "+91 987...")
      if (retailer.contactPhone && retailer.contactPhone.includes(" ")) {
        const parts = retailer.contactPhone.split(" ");
        const code = parts[0];
        const found = countryOptions.find((c) => c.code === code);
        if (found) setSelectedPhoneCountry(found);
      }
    }
  }, [retailer, isOpen]);

  // Filtering Logic for Dropdowns
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

  if (!isOpen || !retailer) return null;

  const toggleBrand = (brandId: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    setIsSaving(true);
    try {
      await onSave(retailer.id, {
        ...data,
        status,
        contactPhone: `${selectedPhoneCountry.code} ${data.rawPhone}`,
        country: selectedCountry?.name || retailer.country,
        state: selectedState?.name || retailer.state,
        city: selectedCity?.name || retailer.city,
        brandIds: selectedBrandIds,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1";
  const lockedInput =
    "w-full px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 text-xs font-bold text-slate-500 flex items-center gap-2 italic cursor-not-allowed";
  const editableInput =
    "w-full px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-gray-800 border-none text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all appearance-none flex items-center justify-between";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-gray-800"
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Edit Partner Profile
              </h2>
              <RetailerStatusBadge status={status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-100 dark:bg-gray-800 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-10 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar"
        >
          {/* 🔒 LOCKED SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Slug (Locked)</label>
              <div className={lockedInput}>
                <Lock size={12} /> {retailer.slug}
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>GSTIN (Locked)</label>
              <div className={lockedInput}>
                <Lock size={12} /> {retailer.gstNumber}
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>PAN (Locked)</label>
              <div className={lockedInput}>
                <Lock size={12} /> {retailer.panNumber || "N/A"}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-gray-800" />

          {/* Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Retailer name</label>
              <input
                name="name"
                defaultValue={retailer.name}
                className={cn(editableInput, "cursor-text")}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Type</label>
              <select
                name="type"
                defaultValue={retailer.type}
                className={cn(editableInput, "cursor-pointer")}
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RetailerStatus)}
                className={cn(editableInput, "cursor-pointer")}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Contact email</label>
              <input
                name="contactEmail"
                defaultValue={retailer.contactEmail}
                className={cn(editableInput, "cursor-text")}
              />
            </div>

            {/* Phone Selector */}
            <div className="space-y-1 relative">
              <label className={labelClasses}>Phone</label>
              <div className="relative flex items-center">
                <div
                  onClick={() =>
                    setOpenDropdown(openDropdown === "phone" ? null : "phone")
                  }
                  className="absolute left-1 flex items-center z-20 pl-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-700 py-1.5 rounded-lg transition-colors"
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
                      "ml-1 text-slate-400",
                      openDropdown === "phone" && "rotate-180",
                    )}
                  />
                </div>
                <input
                  name="rawPhone"
                  defaultValue={retailer.contactPhone?.split(" ")[1] || ""}
                  className={cn(editableInput, "pl-24 cursor-text")}
                />
                {openDropdown === "phone" && (
                  <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden mt-2">
                    <div className="p-2">
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
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 text-[10px] font-bold"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={`https://flagcdn.com/w40/${c.iso}.png`}
                              className="w-4 h-2.5 object-cover rounded-sm"
                              alt=""
                            />{" "}
                            <span>{c.country}</span>
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
              <label className={labelClasses}>Website</label>
              <input
                name="website"
                defaultValue={retailer.website}
                className={cn(editableInput, "cursor-text")}
              />
            </div>
          </div>

          {/* Location Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1 relative">
              <label className={labelClasses}>Country</label>
              <div
                onClick={() => {
                  loadLocationData();
                  setOpenDropdown("country");
                }}
                className={editableInput}
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
                  <span>
                    {selectedCountry?.name ||
                      retailer.country ||
                      "Select Country"}
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              {openDropdown === "country" && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden mt-2 animate-in zoom-in-95">
                  <div className="p-2">
                    <input
                      autoFocus
                      placeholder="Search..."
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
                        className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 text-[10px] font-bold text-left flex items-center gap-3"
                      >
                        <img
                          src={`https://flagcdn.com/w40/${c.iso2.toLowerCase()}.png`}
                          className="w-4 h-2.5 object-cover rounded-sm"
                          alt=""
                        />{" "}
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1 relative">
              <label className={labelClasses}>State</label>
              <div
                onClick={() => selectedCountry && setOpenDropdown("state")}
                className={cn(editableInput, !selectedCountry && "opacity-50")}
              >
                <span>
                  {selectedState?.name || retailer.state || "Select State"}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              {openDropdown === "state" && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden mt-2">
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
                        className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 text-[10px] font-bold text-left"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1 relative">
              <label className={labelClasses}>City</label>
              <div
                onClick={() => selectedState && setOpenDropdown("city")}
                className={cn(editableInput, !selectedState && "opacity-50")}
              >
                <span>
                  {selectedCity?.name || retailer.city || "Select City"}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              {openDropdown === "city" && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden mt-2">
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
                        className="w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 text-[10px] font-bold text-left"
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Detailed Address</label>
            <textarea
              name="address"
              defaultValue={retailer.address}
              rows={2}
              className={cn(editableInput, "resize-none h-auto py-4")}
            />
          </div>

          {/* Brand Auth */}
          <div className="space-y-4">
            <label className={labelClasses}>Brand Authorizations</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {brands?.map((brand: any) => {
                const isSelected = selectedBrandIds.includes(brand.id);
                const flagIso = countryOptions
                  .find((c) => c.country === brand.country)
                  ?.iso.toLowerCase();
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => toggleBrand(brand.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-2xl border transition-all relative group",
                      isSelected
                        ? "bg-blue-600 border-blue-600 shadow-lg"
                        : "bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-800",
                    )}
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs overflow-hidden",
                          isSelected
                            ? "bg-white text-blue-600"
                            : "bg-white dark:bg-gray-900 text-slate-400",
                        )}
                      >
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          brand.name[0]
                        )}
                      </div>
                      {flagIso && (
                        <img
                          src={`https://flagcdn.com/w20/${flagIso}.png`}
                          className="absolute -bottom-1 -right-1 w-4 h-3 border border-white dark:border-gray-900 rounded-sm shadow-sm"
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[9px] font-black uppercase truncate",
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
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-gray-800">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}{" "}
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
