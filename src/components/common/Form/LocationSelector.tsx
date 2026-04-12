"use client";

import {
  useState,
  useMemo,
  useEffect,
  useRef,
  memo,
  createContext,
  useContext,
} from "react";
import { Globe, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { countryOptions } from "@/components/common/countries";

const LocationContext = createContext<any>(null);

export default function LocationRoot({ children, values, onChange }: any) {
  const [allData, setAllData] = useState<any[]>([]);

  useEffect(() => {
    import("@/components/common/countries+states+cities.json").then((data) => {
      const arrayData = (data.default || data) as any[];
      setAllData(arrayData);
    });
  }, []);

  return (
    <LocationContext.Provider value={{ allData, values, onChange }}>
      {children}
    </LocationContext.Provider>
  );
}

const Dropdown = ({ items, onSelect, query, setQuery, type }: any) => (
  <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-65 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
    <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50">
      <Search size={14} className="text-slate-400" />
      <input
        autoFocus
        placeholder="Search..."
        className="w-full bg-transparent border-none py-1 text-sm font-semibold outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
    <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
      {items.length > 0 ? (
        items.map((item: any) => (
          <button
            key={item.iso || item.id || item.name || item.code}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors text-left"
          >
            <div className="flex items-center gap-3 truncate">
              {(type === "phone" || type === "country") &&
                (item.iso || item.iso2) && (
                  <img
                    src={`https://flagcdn.com/w40/${(item.iso || item.iso2).toLowerCase()}.png`}
                    className="w-5 h-3.5 object-cover rounded-sm shrink-0"
                    alt=""
                  />
                )}
              <span className="truncate">{item.country || item.name}</span>
            </div>
            {type === "phone" && (
              <span className="text-xs font-black text-slate-400 ml-2">
                {item.code}
              </span>
            )}
          </button>
        ))
      ) : (
        <div className="py-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          No results found
        </div>
      )}
    </div>
  </div>
);

// ✅ SHARED CONSTANT FOR PIXEL PERFECTION
const SHARED_FIELD_CLASSES =
  "w-full px-4 rounded-xl bg-slate-100 dark:bg-gray-800 border-none text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all cursor-pointer flex items-center justify-between h-[46px]";

export function CountryField({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { allData, values, onChange } = useContext(LocationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  useClickOutside(ref, () => setIsOpen(false));

  const selectedObj = useMemo(
    () => allData.find((c: any) => c.name === values.country),
    [allData, values.country],
  );
  const filtered = useMemo(
    () =>
      allData.filter((c: any) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [allData, query],
  );

  return (
    <div className={cn("space-y-1 relative", className)} ref={ref}>
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 mb-2 block ml-1">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          SHARED_FIELD_CLASSES,
          isOpen && "ring-2 ring-blue-600/40",
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedObj ? (
            <img
              src={`https://flagcdn.com/w40/${selectedObj.iso2.toLowerCase()}.png`}
              className="w-4 h-2.5 object-cover rounded-sm shadow-sm"
              alt=""
            />
          ) : (
            <Globe size={14} className="text-slate-400" />
          )}
          <span className={cn(!values.country && "text-slate-400")}>
            {values.country || "Select Country"}
          </span>
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
        <Dropdown
          items={filtered}
          query={query}
          setQuery={setQuery}
          onSelect={(item: any) => {
            onChange("country", item.name);
            onChange("state", "");
            onChange("city", "");
            setIsOpen(false);
          }}
          type="country"
        />
      )}
    </div>
  );
}

export function StateField({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { allData, values, onChange } = useContext(LocationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  useClickOutside(ref, () => setIsOpen(false));

  const selectedCountry = useMemo(
    () => allData.find((c: any) => c.name === values.country),
    [allData, values.country],
  );
  const filtered = useMemo(
    () =>
      selectedCountry?.states?.filter((s: any) =>
        s.name.toLowerCase().includes(query.toLowerCase()),
      ) || [],
    [selectedCountry, query],
  );

  return (
    <div className={cn("space-y-1 relative", className)} ref={ref}>
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 mb-2 block ml-1">
        {label}
      </label>
      <div
        onClick={() => values.country && setIsOpen(!isOpen)}
        className={cn(
          SHARED_FIELD_CLASSES,
          !values.country && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-blue-600/40",
        )}
      >
        <span className={cn(!values.state && "text-slate-400 truncate")}>
          {values.state || "Select State"}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-slate-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </div>
      {isOpen && (
        <Dropdown
          items={filtered}
          query={query}
          setQuery={setQuery}
          onSelect={(item: any) => {
            onChange("state", item.name);
            onChange("city", "");
            setIsOpen(false);
          }}
          type="state"
        />
      )}
    </div>
  );
}

export function CityField({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { allData, values, onChange } = useContext(LocationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  useClickOutside(ref, () => setIsOpen(false));

  const selectedCountry = useMemo(
    () => allData.find((c: any) => c.name === values.country),
    [allData, values.country],
  );
  const selectedState = useMemo(
    () => selectedCountry?.states?.find((s: any) => s.name === values.state),
    [selectedCountry, values.state],
  );
  const filtered = useMemo(
    () =>
      selectedState?.cities?.filter((c: any) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      ) || [],
    [selectedState, query],
  );

  return (
    <div className={cn("space-y-1 relative", className)} ref={ref}>
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 mb-2 block ml-1">
        {label}
      </label>
      <div
        onClick={() => values.state && setIsOpen(!isOpen)}
        className={cn(
          SHARED_FIELD_CLASSES,
          !values.state && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-blue-600/40",
        )}
      >
        <span className={cn(!values.city && "text-slate-400 truncate")}>
          {values.city || "Select City"}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-slate-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </div>
      {isOpen && (
        <Dropdown
          items={filtered}
          query={query}
          setQuery={setQuery}
          onSelect={(item: any) => {
            onChange("city", item.name);
            setIsOpen(false);
          }}
          type="city"
        />
      )}
    </div>
  );
}

export function PhoneField({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { values, onChange } = useContext(LocationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  useClickOutside(ref, () => setIsOpen(false));

  const selectedPhoneObj = useMemo(
    () =>
      countryOptions.find((c) => c.code === values.phoneCode) ||
      countryOptions.find((c) => c.iso === "in"),
    [values.phoneCode],
  );
  const filtered = useMemo(
    () =>
      countryOptions.filter(
        (c) =>
          c.country.toLowerCase().includes(query.toLowerCase()) ||
          c.code.includes(query),
      ),
    [query],
  );

  return (
    <div className={cn("space-y-1 relative", className)} ref={ref}>
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 mb-2 block ml-1">
        {label}
      </label>
      <div className={cn(SHARED_FIELD_CLASSES, "p-0 overflow-hidden group")}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="h-full flex items-center z-20 pl-4 pr-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors border-r border-slate-200 dark:border-gray-700"
        >
          <img
            src={`https://flagcdn.com/w40/${selectedPhoneObj?.iso}.png`}
            className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
            alt=""
          />
          <span className="text-[11px] font-black text-slate-700 dark:text-gray-300 ml-2">
            {selectedPhoneObj?.code}
          </span>
          <ChevronDown
            size={12}
            className={cn(
              "text-gray-400 ml-1 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>
        <input
          type="tel"
          value={values.phoneNumber || ""}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
          placeholder="98765 43210"
          className="flex-1 h-full bg-transparent px-4 border-none text-xs font-bold text-slate-900 dark:text-white outline-none"
        />
      </div>
      {isOpen && (
        <Dropdown
          items={filtered}
          query={query}
          setQuery={setQuery}
          onSelect={(item: any) => {
            onChange("phoneCode", item.code);
            setIsOpen(false);
          }}
          type="phone"
        />
      )}
    </div>
  );
}
