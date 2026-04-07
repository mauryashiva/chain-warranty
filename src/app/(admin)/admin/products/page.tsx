"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  PackageSearch,
  Edit,
  Barcode,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddProductModal from "@/components/admin/product/AddProductModal";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    "appearance-none bg-slate-100 dark:bg-gray-800/80 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none border-none text-slate-600 dark:text-gray-300 focus:ring-2 ring-blue-600/20 transition-all cursor-pointer pr-10";

  return (
    <div className="space-y-8 min-h-screen bg-white dark:bg-gray-950 pb-20 p-4 md:p-8">
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-50 dark:bg-gray-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            Product Catalog
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400 mt-2">
            Manage product models and specifications for warranty registration.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs transition-all shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-widest"
        >
          <Plus size={18} strokeWidth={3} />
          Add Product
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:flex-1 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={18}
            strokeWidth={3}
          />
          <input
            placeholder="Search products by name, model, or SKU..."
            className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-gray-800/80 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-blue-600/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <div className="flex w-full lg:w-auto items-center gap-4">
          <div className="relative w-full lg:w-auto">
            <select className={selectClasses}>
              <option value="">All Brands</option>
              {/* Map brands here if needed */}
            </select>
            <ChevronDown
              size={14}
              strokeWidth={3}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          <div className="relative w-full lg:w-auto">
            <select className={selectClasses}>
              <option value="">All Categories</option>
              <option value="audio">Audio</option>
              <option value="smartphone">Smartphone</option>
              <option value="laptop">Laptop</option>
              <option value="wearable">Wearable</option>
            </select>
            <ChevronDown
              size={14}
              strokeWidth={3}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Product Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Brand
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Category
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  SKU
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Warranty
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Status
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-32 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-600 mb-6"
                      size={40}
                      strokeWidth={3}
                    />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Loading Catalog...
                    </p>
                  </td>
                </tr>
              ) : products?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <PackageSearch
                        size={32}
                        className="text-slate-300 dark:text-gray-500"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">
                      No products found
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-gray-400">
                      Get started by adding a new product model.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          {p.name}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 mt-1">
                          Model: {p.modelNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 dark:bg-gray-800 text-[11px] font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest">
                        {p.brand?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                      {p.category}
                    </td>
                    <td className="px-8 py-6 text-[11px] font-mono font-bold text-blue-600 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl w-max my-4 inline-block">
                      {p.sku}
                    </td>
                    <td className="px-8 py-6 text-xs font-black text-slate-700 dark:text-gray-300">
                      {p.warrantyPeriod}{" "}
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                        Yrs
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="View Serials"
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
                        >
                          <Barcode size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          title="Edit Product"
                          className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 rounded-xl transition-colors"
                        >
                          <Edit size={16} strokeWidth={2.5} />
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
    </div>
  );
}
