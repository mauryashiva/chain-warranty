"use client";

import { useState, useMemo, useEffect, useRef, memo } from "react";
import { Globe, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { countryOptions } from "@/components/common/countries";

interface LocationSelectorProps {
  fields: ("phone" | "country" | "state" | "city")[];
  values: {
    phoneCode?: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  onChange: (field: string, value: string) => void;
  className?: string;
  showLabels?: boolean; // New prop for professional control
}

export default function LocationSelector({
  fields,
  values,
  onChange,
  className,
  showLabels = true, // Default to true to prevent breaking other components
}: LocationSelectorProps) {
  const [allData, setAllData] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setOpenDropdown(null);
    setSearchQuery("");
  });

  useEffect(() => {
    const needsGeoData = fields.some((f) =>
      ["country", "state", "city"].includes(f),
    );
    if (needsGeoData && allData.length === 0) {
      import("@/components/common/countries+states+cities.json").then(
        (data) => {
          setAllData(data.default as any[]);
        },
      );
    }
  }, [fields, allData.length]);

  const selectedCountryObj = useMemo(
    () => allData.find((c) => c.name === values.country),
    [allData, values.country],
  );

  const selectedStateObj = useMemo(
    () => selectedCountryObj?.states.find((s: any) => s.name === values.state),
    [selectedCountryObj, values.state],
  );

  const selectedPhoneObj = useMemo(
    () =>
      countryOptions.find((c) => c.code === values.phoneCode) ||
      countryOptions.find((c) => c.iso === "in"),
    [values.phoneCode],
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    switch (openDropdown) {
      case "phone":
        return countryOptions.filter(
          (c) => c.country.toLowerCase().includes(q) || c.code.includes(q),
        );
      case "country":
        return allData.filter((c) => c.name.toLowerCase().includes(q));
      case "state":
        return (
          selectedCountryObj?.states.filter((s: any) =>
            s.name.toLowerCase().includes(q),
          ) || []
        );
      case "city":
        return (
          selectedStateObj?.cities.filter((c: any) =>
            c.name.toLowerCase().includes(q),
          ) || []
        );
      default:
        return [];
    }
  }, [
    searchQuery,
    openDropdown,
    allData,
    selectedCountryObj,
    selectedStateObj,
  ]);

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1";

  const inputBaseClasses =
    "w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800 text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between transition-all duration-200 hover:border-blue-500/50 outline-none cursor-pointer";

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className,
      )}
      ref={containerRef}
    >
      {fields.includes("phone") && (
        <div className="space-y-1 relative">
          {showLabels && <label className={labelClasses}>Contact Phone</label>}
          <div className="relative flex items-center group">
            <div
              onClick={() =>
                setOpenDropdown(openDropdown === "phone" ? null : "phone")
              }
              className="absolute left-1 flex items-center z-20 pl-2 pr-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-700 py-1.5 rounded-lg transition-colors"
            >
              <img
                src={`https://flagcdn.com/w40/${selectedPhoneObj?.iso}.png`}
                className="w-4 h-2.5 object-cover rounded-sm mr-1.5 shadow-sm"
                alt=""
              />
              <span className="text-[11px] font-black text-slate-700 dark:text-gray-300">
                {selectedPhoneObj?.code}
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
              type="tel"
              value={values.phoneNumber || ""}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              placeholder="98765 43210"
              className={cn(
                inputBaseClasses,
                "pl-24 cursor-text focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600",
              )}
            />
          </div>
          {openDropdown === "phone" && (
            <DropdownWrapper
              query={searchQuery}
              setQuery={setSearchQuery}
              items={filteredItems}
              onSelect={(item: any) => {
                onChange("phoneCode", item.code);
                setOpenDropdown(null);
              }}
              type="phone"
            />
          )}
        </div>
      )}

      {fields.includes("country") && (
        <div className="space-y-1 relative">
          {showLabels && <label className={labelClasses}>Country</label>}
          <div
            onClick={() =>
              setOpenDropdown(openDropdown === "country" ? null : "country")
            }
            className={cn(
              inputBaseClasses,
              openDropdown === "country" &&
                "bg-white dark:bg-gray-900 ring-4 ring-blue-600/10 border-blue-600",
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedCountryObj ? (
                <img
                  src={`https://flagcdn.com/w40/${selectedCountryObj.iso2.toLowerCase()}.png`}
                  className="w-4 h-2.5 object-cover rounded-sm shadow-sm"
                  alt=""
                />
              ) : (
                <Globe size={14} className="text-slate-400" />
              )}
              <span className="truncate">
                {values.country || "Select Country"}
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
          {openDropdown === "country" && (
            <DropdownWrapper
              query={searchQuery}
              setQuery={setSearchQuery}
              items={filteredItems}
              onSelect={(item: any) => {
                onChange("country", item.name);
                onChange("state", "");
                onChange("city", "");
                setOpenDropdown(null);
              }}
              type="country"
            />
          )}
        </div>
      )}

      {fields.includes("state") && (
        <div className="space-y-1 relative">
          {showLabels && (
            <label className={labelClasses}>State / Province</label>
          )}
          <div
            onClick={() =>
              values.country &&
              setOpenDropdown(openDropdown === "state" ? null : "state")
            }
            className={cn(
              inputBaseClasses,
              !values.country && "opacity-50 cursor-not-allowed grayscale",
              openDropdown === "state" &&
                "bg-white dark:bg-gray-900 ring-4 ring-blue-600/10 border-blue-600",
            )}
          >
            <span className="truncate">{values.state || "Select State"}</span>
            <ChevronDown
              size={14}
              className={cn(
                "text-slate-400 transition-transform",
                openDropdown === "state" && "rotate-180",
              )}
            />
          </div>
          {openDropdown === "state" && (
            <DropdownWrapper
              query={searchQuery}
              setQuery={setSearchQuery}
              items={filteredItems}
              onSelect={(item: any) => {
                onChange("state", item.name);
                onChange("city", "");
                setOpenDropdown(null);
              }}
              type="state"
            />
          )}
        </div>
      )}

      {fields.includes("city") && (
        <div className="space-y-1 relative">
          {showLabels && <label className={labelClasses}>City</label>}
          <div
            onClick={() =>
              values.state &&
              setOpenDropdown(openDropdown === "city" ? null : "city")
            }
            className={cn(
              inputBaseClasses,
              !values.state && "opacity-50 cursor-not-allowed grayscale",
              openDropdown === "city" &&
                "bg-white dark:bg-gray-900 ring-4 ring-blue-600/10 border-blue-600",
            )}
          >
            <span className="truncate">{values.city || "Select City"}</span>
            <ChevronDown
              size={14}
              className={cn(
                "text-slate-400 transition-transform",
                openDropdown === "city" && "rotate-180",
              )}
            />
          </div>
          {openDropdown === "city" && (
            <DropdownWrapper
              query={searchQuery}
              setQuery={setSearchQuery}
              items={filteredItems}
              onSelect={(item: any) => {
                onChange("city", item.name);
                setOpenDropdown(null);
              }}
              type="city"
            />
          )}
        </div>
      )}
    </div>
  );
}

// DROPDOWN UI
interface DropdownWrapperProps {
  query: string;
  setQuery: (q: string) => void;
  items: any[];
  onSelect: (item: any) => void;
  type: "phone" | "country" | "state" | "city";
}

const DropdownWrapper = memo(
  ({ query, setQuery, items, onSelect, type }: DropdownWrapperProps) => {
    return (
      <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-70 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-4xl shadow-2xl z-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-3 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50 flex items-center gap-2">
          <Search size={14} className="text-slate-400" />
          <input
            autoFocus
            placeholder="Search..."
            className="w-full bg-transparent border-none py-1 text-xs font-bold outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
          {items.length > 0 ? (
            items.map((item: any) => {
              const itemKey = item.id || item.iso2 || item.iso || item.name;
              const displayName = item.country || item.name;
              const flagIso = (item.iso || item.iso2)?.toLowerCase();

              return (
                <button
                  key={`${type}-${itemKey}`}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 truncate">
                    {(type === "phone" || type === "country") && flagIso && (
                      <img
                        src={`https://flagcdn.com/w40/${flagIso}.png`}
                        className="w-5 h-3.5 object-cover rounded-sm shrink-0 shadow-sm"
                        alt=""
                      />
                    )}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600">
                      {displayName}
                    </span>
                  </div>
                  {type === "phone" && (
                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded-md ml-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {item.code}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                No results found
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

DropdownWrapper.displayName = "DropdownWrapper";
