"use client";

import { useState, useMemo, useRef } from "react";
import {
  Search,
  ChevronDown,
  Check,
  Store,
  Loader2,
  AlertOctagon,
} from "lucide-react";
import { useAdminRetailers } from "@/hooks/admin/use-admin-retailers";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

interface RetailerSelectProps {
  value: string; // Retailer ID
  onChange: (retailerId: string) => void;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function RetailerSelect({
  value,
  onChange,
  error,
  disabled,
  placeholder = "Select Retailer...",
}: RetailerSelectProps) {
  const { retailers, loading } = useAdminRetailers();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  // 🛡️ Logic: Filter by Active status and Search Query
  // We show SUSPENDED retailers but keep them disabled in the list
  const filteredRetailers = useMemo(() => {
    return retailers?.filter(
      (r: any) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.city?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [retailers, searchQuery]);

  const selectedRetailer = useMemo(
    () => retailers?.find((r: any) => r.id === value),
    [retailers, value],
  );

  const labelClasses = "text-[10px] font-black uppercase tracking-widest";

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => !loading && !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 border-2 border-transparent text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between transition-all cursor-pointer",
          isOpen &&
            "ring-2 ring-blue-600/20 border-blue-600/50 bg-white dark:bg-gray-900",
          error && "border-rose-500/50 bg-rose-500/5",
          (loading || disabled) &&
            "opacity-50 cursor-not-allowed grayscale-[0.5]",
        )}
      >
        <div className="flex items-center gap-3 truncate">
          {loading ? (
            <Loader2 size={14} className="animate-spin text-slate-400" />
          ) : selectedRetailer ? (
            <div className="flex flex-col truncate">
              <span className="flex items-center gap-2">
                <Store size={14} className="text-blue-600" />
                {selectedRetailer.name}
              </span>
              <span className="text-[9px] text-slate-500 ml-5 uppercase tracking-tighter">
                {selectedRetailer.city}, {selectedRetailer.state}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 flex items-center gap-2">
              <Store size={14} className="opacity-50" />
              {placeholder}
            </span>
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
          {/* Search Header */}
          <div className="p-2 border-b border-slate-100 dark:border-gray-800">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                autoFocus
                placeholder="Search by name or city..."
                className="w-full bg-slate-50 dark:bg-gray-800/50 border-none rounded-lg py-2 pl-9 pr-4 text-[11px] font-bold outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* List Section */}
          <div className="max-h-64 overflow-y-auto p-1 custom-scrollbar">
            {filteredRetailers?.length ? (
              filteredRetailers.map((retailer: any) => {
                const isSuspended = retailer.status === "SUSPENDED";
                const isInactive = retailer.status === "INACTIVE";

                return (
                  <button
                    key={retailer.id}
                    type="button"
                    disabled={isSuspended || isInactive}
                    onClick={() => {
                      onChange(retailer.id);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all text-left group mb-1",
                      value === retailer.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50",
                      (isSuspended || isInactive) &&
                        "opacity-50 cursor-not-allowed bg-slate-50/50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          value === retailer.id
                            ? "bg-white shadow-sm"
                            : "bg-white dark:bg-gray-800",
                        )}
                      >
                        {isSuspended ? (
                          <AlertOctagon size={14} className="text-rose-500" />
                        ) : (
                          <Store
                            size={14}
                            className={
                              value === retailer.id
                                ? "text-blue-600"
                                : "text-slate-400"
                            }
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black tracking-tight leading-none uppercase">
                            {retailer.name}
                          </p>
                          {isSuspended && (
                            <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black uppercase">
                              Suspended
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                          {retailer.city} • {retailer.type}
                        </p>
                      </div>
                    </div>
                    {value === retailer.id && (
                      <Check size={14} strokeWidth={3} />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  No partners found
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
