"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Globe,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddBrandModal from "@/components/admin/brand/AddBrandModal";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";

export default function AdminBrandsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 REAL DATA HOOK
  // This hook will handle fetching (brands), loading states (isLoading), and actions (createBrand)
  const { brands, isLoading, error, createBrand, refresh } = useAdminBrands();

  const handleSaveBrand = async (formData: any) => {
    try {
      await createBrand(formData);
      setIsModalOpen(false);
      refresh(); // Reload the list from the database
    } catch (err) {
      console.error("Failed to save brand:", err);
    }
  };

  // Filter logic for search
  const filteredBrands =
    brands?.filter(
      (b: any) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.country.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <div className="space-y-8 bg-white dark:bg-gray-900 min-h-screen">
      <AddBrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBrand}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
            Brand Catalog
          </h1>
          <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mt-1">
            System-level manufacturer registry for blockchain verification.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} strokeWidth={4} />
          ADD NEW BRAND
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 text-rose-600">
          <AlertCircle size={24} />
          <p className="text-xs font-black uppercase tracking-widest">
            Error Loading Catalog: {error}
          </p>
        </div>
      )}

      {/* Stats Overview (Dynamically calculated from real data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Brands", value: brands?.length || 0 },
          {
            label: "Active Brands",
            value:
              brands?.filter((b: any) => b.status === "Active").length || 0,
          },
          { label: "System Uptime", value: "99.9%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-8 rounded-[2.5rem] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {isLoading ? "---" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-900/50">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH CATALOG..."
              className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-[11px] font-black outline-none focus:ring-2 ring-blue-600/20 transition-all text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/40">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Brand Identity
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Slug Path
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Location
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Status
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-600 mb-4"
                      size={32}
                    />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Fetching Encrypted Records...
                    </p>
                  </td>
                </tr>
              ) : filteredBrands.length > 0 ? (
                filteredBrands.map((brand: any) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-white dark:hover:bg-gray-900/40 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/20">
                          {brand.name[0]}
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase">
                          {brand.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-600/5 px-3 py-1.5 rounded-lg border border-blue-600/10">
                        /{brand.slug}
                      </code>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-[11px] font-black uppercase tracking-tight">
                        <Globe size={14} className="text-blue-500" />{" "}
                        {brand.country}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.1em] uppercase border",
                          brand.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : "bg-gray-200 text-gray-500 border-gray-300 dark:bg-gray-900",
                        )}
                      >
                        <div
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            brand.status === "Active"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-gray-400",
                          )}
                        />
                        {brand.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                        <MoreHorizontal size={20} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
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
