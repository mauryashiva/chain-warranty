"use client";

import { useState } from "react";
import { Plus, Search, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import AddProductModal from "@/components/admin/product/AddProductModal";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { products, loading, addProduct, fetchProducts } = useAdminProducts();

  const handleSaveProduct = async (data: any) => {
    try {
      await addProduct(data);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  const selectClasses =
    "appearance-none bg-transparent text-[11px] font-black uppercase tracking-widest outline-none border-none text-slate-900 dark:text-white cursor-pointer pr-8";

  return (
    <div className="space-y-8 min-h-screen bg-white dark:bg-gray-950 pb-20 p-4 md:p-8">
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Products
          </h1>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight mt-1">
            All product models eligible for warranty registration
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:opacity-70 transition-opacity flex items-center gap-1"
        >
          <Plus size={12} strokeWidth={4} /> Add product
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col lg:flex-row items-center gap-6 border-b border-slate-100 dark:border-gray-800 pb-6">
        <div className="relative w-full lg:flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full py-2.5 bg-transparent border border-slate-200 dark:border-gray-800 rounded-sm pl-10 pr-3 text-xs font-medium outline-none focus:border-slate-900 dark:focus:border-white transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            <select className={selectClasses}>
              <option value="">All brands</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 text-slate-900 dark:text-white pointer-events-none"
            />
          </div>

          <div className="relative flex items-center border border-slate-900 dark:border-white rounded-sm px-3 py-1">
            <select className={selectClasses}>
              <option value="">All categories</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 text-slate-900 dark:text-white pointer-events-none"
            />
          </div>

          <div className="relative flex items-center">
            <select className={selectClasses}>
              <option value="">All status</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 text-slate-900 dark:text-white pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-250">
          <thead>
            <tr className="border-b border-slate-50 dark:border-gray-900">
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[25%]">
                Product
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[12%]">
                Brand
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[12%]">
                Category
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[12%]">
                SKU
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[10%] text-center">
                Warranty (Yrs)
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[12%]">
                Price Range
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[8%] text-center">
                Serials
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[8%]">
                Status
              </th>
              <th className="px-4 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 w-[10%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-900 dark:text-white">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-24 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-slate-400"
                    size={24}
                  />
                </td>
              </tr>
            ) : products?.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-24 text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    No products found
                  </p>
                </td>
              </tr>
            ) : (
              products.map((p: any) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-50 dark:border-gray-900 hover:bg-slate-50 dark:hover:bg-gray-900/40 transition-colors group"
                >
                  <td className="px-4 py-6">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase mt-1.5 tabular-nums">
                        {p.modelNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-[11px] font-bold uppercase">
                    {p.brand?.name || "—"}
                  </td>
                  <td className="px-4 py-6 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">
                    {p.category || "—"}
                  </td>
                  <td className="px-4 py-6 text-[10px] font-bold text-slate-500 uppercase font-mono">
                    {p.sku || "—"}
                  </td>
                  <td className="px-4 py-6 text-[11px] font-black text-center tabular-nums">
                    {p.warrantyPeriod || "0"}
                  </td>
                  <td className="px-4 py-6 text-[11px] font-bold tabular-nums">
                    {p.priceMin
                      ? `$${p.priceMin.toLocaleString()}–$${p.priceMax?.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-6 text-[11px] font-black text-center tabular-nums text-blue-600">
                    {p._count?.serials?.toLocaleString() || "0"}
                  </td>
                  <td className="px-4 py-6">
                    <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-sm">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Edit
                      </button>
                      <button className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Serials
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
