"use client";

import { useState, useMemo, useRef } from "react";
import {
  Search,
  ChevronDown,
  Check,
  Package,
  Loader2,
  Tag,
} from "lucide-react";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

interface ProductSelectProps {
  value: string; // Product ID
  onChange: (productId: string) => void;
  brandId?: string; // Optional: Filter products by this Brand
  error?: boolean;
  disabled?: boolean;
}

export default function ProductSelect({
  value,
  onChange,
  brandId,
  error,
  disabled,
}: ProductSelectProps) {
  const { products, loading } = useAdminProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  // 🛡️ Logic: Filter by Brand (if provided), Status (Active), and Search Query
  const filteredProducts = useMemo(() => {
    return products?.filter((p: any) => {
      const isStatusActive = p.status === "ACTIVE";
      const matchesBrand = !brandId || p.brandId === brandId;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase());

      return isStatusActive && matchesBrand && matchesSearch;
    });
  }, [products, brandId, searchQuery]);

  const selectedProduct = useMemo(
    () => products?.find((p: any) => p.id === value),
    [products, value],
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => !loading && !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-gray-800 border-2 border-transparent text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between transition-all",
          isOpen &&
            "ring-2 ring-blue-600/20 border-blue-600/50 bg-white dark:bg-gray-900",
          error && "border-rose-500/50 bg-rose-500/5",
          (loading || disabled || (!brandId && !selectedProduct)) &&
            "opacity-50 cursor-not-allowed grayscale-[0.5]",
        )}
      >
        <div className="flex items-center gap-3 truncate">
          {loading ? (
            <Loader2 size={14} className="animate-spin text-slate-400" />
          ) : selectedProduct ? (
            <div className="flex flex-col truncate">
              <span className="flex items-center gap-2">
                <Package size={14} className="text-blue-600" />
                {selectedProduct.name}
              </span>
              <span className="text-[9px] text-slate-500 ml-5 uppercase tracking-tighter font-mono">
                SKU: {selectedProduct.sku}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 flex items-center gap-2">
              {!brandId ? "Select Brand First..." : "Select Product / SKU..."}
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
          <div className="p-2 border-b border-slate-100 dark:border-gray-800">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                autoFocus
                placeholder="Search by name or SKU..."
                className="w-full bg-slate-50 dark:bg-gray-800/50 border-none rounded-lg py-2 pl-9 pr-4 text-[11px] font-bold outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredProducts?.length ? (
              filteredProducts.map((product: any) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onChange(product.id);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all text-left group",
                    value === product.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "hover:bg-slate-50 dark:hover:bg-gray-800/50 text-slate-700 dark:text-slate-300",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        value === product.id
                          ? "bg-white shadow-sm"
                          : "bg-slate-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700",
                      )}
                    >
                      <Tag
                        size={14}
                        className={
                          value === product.id
                            ? "text-blue-600"
                            : "text-slate-400"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-tight leading-none uppercase">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[9px] font-bold text-slate-500 font-mono tracking-tighter uppercase">
                          {product.sku}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </div>
                  {value === product.id && <Check size={14} strokeWidth={3} />}
                </button>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  No matching models found
                </p>
                {!brandId && (
                  <p className="text-[8px] font-bold text-blue-500 uppercase mt-1">
                    Try selecting a brand first
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
