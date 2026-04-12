"use client";

import { useState, useMemo, useRef } from "react";
import {
  Search,
  ChevronDown,
  Check,
  Globe,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { countryOptions } from "@/components/common/countries";

interface BrandSelectProps {
  value: string; // Brand ID
  onChange: (brandId: string) => void;
  error?: boolean;
}

export default function BrandSelect({
  value,
  onChange,
  error,
}: BrandSelectProps) {
  const { brands, isLoading } = useAdminBrands();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  // 🛡️ Logic: Filter only ACTIVE brands and match search query
  const filteredBrands = useMemo(() => {
    return brands?.filter((b: any) => {
      const isStatusActive = b.status === "ACTIVE" || b.status === "Active";
      const matchesSearch = b.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return isStatusActive && matchesSearch;
    });
  }, [brands, searchQuery]);

  const selectedBrand = useMemo(
    () => brands?.find((b: any) => b.id === value),
    [brands, value],
  );

  // Find flag for selected brand
  const selectedCountryFlag = useMemo(() => {
    if (!selectedBrand?.country) return null;
    return countryOptions
      .find((c) => c.country === selectedBrand.country)
      ?.iso.toLowerCase();
  }, [selectedBrand]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 border-2 border-transparent text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer transition-all",
          isOpen &&
            "ring-2 ring-blue-600/20 border-blue-600/50 bg-white dark:bg-gray-900",
          error && "border-rose-500/50 bg-rose-500/5",
          isLoading && "opacity-60 cursor-not-allowed",
        )}
      >
        <div className="flex items-center gap-3 truncate">
          {isLoading ? (
            <Loader2 size={14} className="animate-spin text-slate-400" />
          ) : selectedBrand ? (
            <div className="flex items-center gap-2">
              {selectedBrand.logoUrl ? (
                <img
                  src={selectedBrand.logoUrl}
                  className="w-5 h-5 rounded-md object-contain bg-white p-0.5"
                  alt=""
                />
              ) : (
                <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">
                  {selectedBrand.name.charAt(0)}
                </div>
              )}
              <span>{selectedBrand.name}</span>
              {selectedCountryFlag && (
                <img
                  src={`https://flagcdn.com/w20/${selectedCountryFlag}.png`}
                  className="w-3 h-2 rounded-sm"
                  alt=""
                />
              )}
            </div>
          ) : (
            <span className="text-slate-400">Select Manufacturer...</span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "text-slate-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-100 dark:border-gray-800">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                autoFocus
                placeholder="Search brands..."
                className="w-full bg-slate-50 dark:bg-gray-800/50 border-none rounded-lg py-2 pl-9 pr-4 text-[11px] font-bold outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredBrands?.length ? (
              filteredBrands.map((brand: any) => {
                const flagIso = countryOptions
                  .find((c) => c.country === brand.country)
                  ?.iso.toLowerCase();
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => {
                      onChange(brand.id);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left group",
                      value === brand.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50 text-slate-700 dark:text-slate-300",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            className="w-8 h-8 rounded-lg object-contain bg-white p-1 border border-slate-100 shadow-sm"
                            alt=""
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                            <ImageIcon size={14} className="text-slate-400" />
                          </div>
                        )}
                        {flagIso && (
                          <img
                            src={`https://flagcdn.com/w20/${flagIso}.png`}
                            className="absolute -bottom-1 -right-1 w-4 h-3 border border-white dark:border-gray-900 rounded-sm shadow-sm"
                            alt=""
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black tracking-tight">
                          {brand.name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          {brand.country}
                        </p>
                      </div>
                    </div>
                    {value === brand.id && <Check size={14} strokeWidth={3} />}
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                No active brands found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
