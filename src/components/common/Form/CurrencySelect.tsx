"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCIES } from "@/components/common/currencies";

export default function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const toggleDropdown = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === value) || CURRENCIES[0];

  return (
    /* ✅ h-full allows it to fill the h-[52px] parent container */
    <div className="relative w-full h-full" ref={containerRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full h-full px-4 flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-l-2xl outline-none hover:border-gray-300 transition-all focus:border-blue-600"
      >
        <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 uppercase truncate">
          {selectedCurrency.code} ({selectedCurrency.symbol})
        </span>
        <ChevronDown className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} size={14} />
      </button>

      {isOpen && createPortal(
        <div 
          className="fixed z-[9999] bg-white dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          style={{ top: coords.top + 6, left: coords.left, width: Math.max(coords.width, 260) }}
        >
          <div className="p-3 bg-slate-50 dark:bg-gray-900/50 border-b border-slate-100">
            <input
              autoFocus
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-bold outline-none border border-slate-200"
            />
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {CURRENCIES.filter(c => c.code.toLowerCase().includes(search.toLowerCase())).map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(c.code); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-black hover:bg-blue-600 hover:text-white transition-all flex justify-between"
              >
                <span>{c.code} — {c.name}</span>
                <span className="opacity-50">{c.symbol}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}