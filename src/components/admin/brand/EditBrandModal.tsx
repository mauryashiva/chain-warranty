"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  X,
  Globe,
  Mail,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronDown,
  Search,
  Lock,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { countryOptions, CountryOption } from "@/components/common/countries";
import StatusToggle from "./StatusToggle";

interface EditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void> | void;
  brand: any;
}

export default function EditBrandModal({
  isOpen,
  onClose,
  onSave,
  brand,
}: EditBrandModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const phoneDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedPhoneCountry, setSelectedPhoneCountry] =
    useState<CountryOption>(
      countryOptions.find((c) => c.iso === "in") || countryOptions[0],
    );
  const [selectedOriginCountry, setSelectedOriginCountry] =
    useState<CountryOption | null>(null);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [phoneSearchQuery, setPhoneSearchQuery] = useState("");
  const [countrySearchQuery, setCountrySearchQuery] = useState("");

  // Sync brand data to state
  useEffect(() => {
    if (brand && isOpen) {
      setStatus(
        brand.status?.toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE",
      );

      // Parse Phone
      if (brand.supportPhone) {
        const found = countryOptions.find((c) =>
          brand.supportPhone.startsWith(c.code),
        );
        if (found) setSelectedPhoneCountry(found);
      }

      // Find Origin Country
      if (brand.country) {
        const found = countryOptions.find((c) => c.country === brand.country);
        if (found) setSelectedOriginCountry(found);
      }
    }
  }, [brand, isOpen]);

  // Memoized Filters
  const filteredPhoneCountries = useMemo(() => {
    const query = phoneSearchQuery.toLowerCase().replace("+", "");
    return countryOptions.filter(
      (c) =>
        c.country.toLowerCase().includes(query) ||
        c.code.replace("+", "").includes(query),
    );
  }, [phoneSearchQuery]);

  const filteredOriginCountries = useMemo(() => {
    const query = countrySearchQuery.toLowerCase();
    return countryOptions.filter((c) =>
      c.country.toLowerCase().includes(query),
    );
  }, [countrySearchQuery]);

  useClickOutside(modalRef, onClose);
  useClickOutside(phoneDropdownRef, () => setIsPhoneDropdownOpen(false));
  useClickOutside(countryDropdownRef, () => setIsCountryDropdownOpen(false));

  if (!isOpen || !brand) return null;

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200 mb-2 block ml-1";

  const inputClasses =
    "w-full px-4 py-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-500/10 shadow-sm";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.rawPhone) {
      data.supportPhone = `${selectedPhoneCountry.code} ${data.rawPhone}`;
    }

    data.country = selectedOriginCountry?.country || brand.country;
    data.status = status;

    delete data.rawPhone;
    await onSave(brand.id, data);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-indigo-500" />

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between bg-white dark:bg-gray-900 z-10 relative">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
              Edit Brand Identity
            </h2>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">
              Modify manufacturer profile and system status in the catalog.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all active:scale-95"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <form
          id="editBrandForm"
          onSubmit={handleSubmit}
          className="p-8 overflow-y-auto max-h-[65vh] custom-scrollbar"
        >
          {/* Status Section */}
          <div className="mb-8 flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">
                Account Status
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
                Control brand visibility across the registry
              </p>
            </div>
            <StatusToggle value={status} onChange={setStatus} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Brand Name */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand Name *</label>
              <input
                name="name"
                defaultValue={brand.name}
                required
                className={inputClasses}
              />
            </div>

            {/* Brand Slug (Locked) */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand Slug (Locked)</label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  value={brand.slug}
                  disabled
                  className={cn(
                    inputClasses,
                    "pl-10 opacity-60 cursor-not-allowed italic bg-gray-100/50 dark:bg-gray-800/50",
                  )}
                />
              </div>
            </div>

            {/* Country of Origin */}
            <div className="space-y-1 relative" ref={countryDropdownRef}>
              <label className={labelClasses}>Country of Origin *</label>
              <div
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className={cn(
                  inputClasses,
                  "flex items-center justify-between cursor-pointer",
                )}
              >
                <div className="flex items-center gap-3">
                  {selectedOriginCountry ? (
                    <>
                      <img
                        src={`https://flagcdn.com/w40/${selectedOriginCountry.iso}.png`}
                        alt=""
                        className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                      />
                      <span>{selectedOriginCountry.country}</span>
                    </>
                  ) : (
                    <>
                      <Globe size={16} className="text-gray-400" />
                      <span className="text-gray-400 font-bold">
                        Select Country
                      </span>
                    </>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-gray-400 transition-transform",
                    isCountryDropdownOpen && "rotate-180",
                  )}
                />
              </div>

              {isCountryDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={14}
                      />
                      <input
                        autoFocus
                        placeholder="Search country..."
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-lg py-2 pl-9 pr-4 text-xs font-bold outline-none"
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                    {filteredOriginCountries.map((c) => (
                      <button
                        key={c.iso}
                        type="button"
                        onClick={() => {
                          setSelectedOriginCountry(c);
                          setIsCountryDropdownOpen(false);
                          setCountrySearchQuery("");
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left text-xs font-bold",
                          selectedOriginCountry?.iso === c.iso
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300",
                        )}
                      >
                        <img
                          src={`https://flagcdn.com/w40/${c.iso}.png`}
                          className="w-5 h-3.5 object-cover rounded-sm"
                          alt=""
                        />
                        {c.country}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Official Website */}
            <div className="space-y-1">
              <label className={labelClasses}>Official Website</label>
              <div className="relative group">
                <LinkIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                  strokeWidth={2.5}
                />
                <input
                  name="website"
                  type="url"
                  defaultValue={brand.website}
                  placeholder="https://sony.com"
                  className={cn(inputClasses, "pl-12")}
                />
              </div>
            </div>

            {/* Support Phone */}
            <div className="space-y-1" ref={phoneDropdownRef}>
              <label className={labelClasses}>Support Phone</label>
              <div className="relative flex items-center group">
                <div
                  onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                  className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center z-20 pl-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 py-1.5 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2 pr-1">
                    <img
                      src={`https://flagcdn.com/w40/${selectedPhoneCountry.iso}.png`}
                      alt={selectedPhoneCountry.country}
                      className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                    />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {selectedPhoneCountry.code}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    strokeWidth={3}
                    className={cn(
                      "text-gray-400 ml-1 transition-transform",
                      isPhoneDropdownOpen && "rotate-180",
                    )}
                  />
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 ml-3 mr-2" />
                </div>
                {isPhoneDropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={14}
                        />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search country or code..."
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-lg py-2 pl-9 pr-4 text-xs font-bold outline-none"
                          value={phoneSearchQuery}
                          onChange={(e) => setPhoneSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                      {filteredPhoneCountries.map((country) => (
                        <button
                          key={country.iso}
                          type="button"
                          onClick={() => {
                            setSelectedPhoneCountry(country);
                            setIsPhoneDropdownOpen(false);
                            setPhoneSearchQuery("");
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left",
                            selectedPhoneCountry.iso === country.iso
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://flagcdn.com/w40/${country.iso}.png`}
                              className="w-5 h-3.5 object-cover rounded-sm"
                              alt=""
                            />
                            <span className="text-xs font-bold truncate max-w-35">
                              {country.country}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-gray-800 dark:text-gray-200">
                            {country.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <input
                  name="rawPhone"
                  type="tel"
                  defaultValue={brand.supportPhone
                    ?.split(" ")
                    .slice(1)
                    .join(" ")}
                  placeholder="98765 43210"
                  className={cn(inputClasses, "pl-36")}
                />
              </div>
            </div>

            {/* Support Email */}
            <div className="space-y-1">
              <label className={labelClasses}>Support Email</label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                  strokeWidth={2.5}
                />
                <input
                  name="supportEmail"
                  type="email"
                  defaultValue={brand.supportEmail}
                  placeholder="support@sony.com"
                  className={cn(inputClasses, "pl-12")}
                />
              </div>
            </div>

            {/* Tax ID */}
            <div className="space-y-1">
              <label className={labelClasses}>GST / Tax ID</label>
              <div className="relative group">
                <FileText
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                  strokeWidth={2.5}
                />
                <input
                  name="taxId"
                  defaultValue={brand.taxId}
                  placeholder="Tax Identification Number"
                  className={cn(inputClasses, "pl-12")}
                />
              </div>
            </div>

            {/* Brand Logo URL */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand Logo URL</label>
              <div className="relative group">
                <ImageIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                  strokeWidth={2.5}
                />
                <input
                  name="logoUrl"
                  type="url"
                  defaultValue={brand.logoUrl}
                  placeholder="https://..."
                  className={cn(inputClasses, "pl-12")}
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1 pt-2">
              <label className={labelClasses}>Brand Description</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={brand.description}
                placeholder="Briefly describe the brand..."
                className={cn(inputClasses, "resize-none font-medium")}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-end gap-3 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 text-[11px] font-black text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="editBrandForm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            Update Brand
          </button>
        </div>
      </div>
    </div>
  );
}
