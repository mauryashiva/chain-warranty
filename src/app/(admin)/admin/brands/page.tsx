"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  AlertCircle,
  Settings2,
  Package2,
  ShieldOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddBrandModal from "@/components/admin/brand/AddBrandModal";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";

export default function AdminBrandsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { brands, isLoading, error, createBrand, refresh } = useAdminBrands();

  const handleSaveBrand = async (formData: any) => {
    try {
      await createBrand(formData);
      setIsModalOpen(false);
      refresh();
    } catch (err) {
      console.error("Failed to save brand:", err);
    }
  };

  const filteredBrands =
    brands?.filter(
      (b: any) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.country.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200";

  return (
    <div className="space-y-10 bg-white dark:bg-gray-900 min-h-screen pb-24 px-6 md:px-10 pt-8">
      <AddBrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBrand}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-gray-800 pb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Brands
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1">
            Manage all product brands registered in the system
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2.5 bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black text-[11px] tracking-widest transition-all hover:opacity-90 active:scale-95 shadow-xl shadow-slate-900/10 dark:shadow-none"
        >
          <Plus size={16} strokeWidth={4} />
          ADD BRAND
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-4xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4 text-rose-600">
          <AlertCircle size={20} strokeWidth={3} />
          <p className="text-[10px] font-black uppercase tracking-widest">
            Error Loading Catalog: {error}
          </p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total brands", value: brands?.length || 0 },
          {
            label: "Active",
            value:
              brands?.filter((b: any) => b.status === "Active").length || 0,
          },
          {
            label: "Products",
            value:
              brands?.reduce(
                (acc: number, b: any) => acc + (b._count?.products || 0),
                0,
              ) || 0,
          },
          { label: "Warranties", value: "1.2k" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-50/50 dark:bg-gray-800/30 border border-slate-100 dark:border-gray-800 p-6 rounded-4xl"
          >
            <p className={labelClasses + " mb-3 opacity-60"}>{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
              {isLoading ? "---" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
          size={18}
          strokeWidth={3}
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="FILTER BY NAME OR COUNTRY..."
          className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800 rounded-3xl text-[10px] font-black outline-none focus:ring-4 ring-blue-600/10 transition-all text-gray-900 dark:text-white placeholder:text-slate-400"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-800/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Brand Name
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Slug
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Country
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 text-center">
                  Products
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 text-center">
                  Warranties Issued
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 text-center">
                  Status
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-600 mb-4"
                      size={32}
                      strokeWidth={3}
                    />
                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em]">
                      Synchronizing Registry...
                    </p>
                  </td>
                </tr>
              ) : filteredBrands.length > 0 ? (
                filteredBrands.map((brand: any) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    {/* Brand Name & ID stacked vertically */}
                    <td className="px-10 py-6 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-black text-gray-900 dark:text-white uppercase tracking-tight">
                          {brand.name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          ID: {brand.id.slice(-7).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {brand.slug}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                        {brand.country}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[11px] font-black text-slate-900 dark:text-white tabular-nums">
                        {brand._count?.products || 0}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[11px] font-black text-slate-900 dark:text-white tabular-nums">
                        {Math.floor(Math.random() * 500)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border",
                          brand.status === "Active"
                            ? "text-emerald-600 bg-emerald-500/5 border-emerald-500/10"
                            : "text-slate-400 bg-slate-100/50 border-slate-200 dark:border-gray-800",
                        )}
                      >
                        {brand.status}
                      </span>
                    </td>
                    {/* Actions Centered */}
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="Edit Brand"
                          className="p-2.5 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-all rounded-xl border border-slate-100 dark:border-gray-700"
                        >
                          <Settings2 size={14} />
                        </button>
                        <button
                          title="View Products"
                          className="p-2.5 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-all rounded-xl border border-slate-100 dark:border-gray-700"
                        >
                          <Package2 size={14} />
                        </button>
                        <button
                          title="Disable Brand"
                          className="p-2.5 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-slate-200 hover:bg-rose-600 hover:text-white transition-all rounded-xl border border-slate-100 dark:border-gray-700"
                        >
                          <ShieldOff size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      No matching brand records found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
