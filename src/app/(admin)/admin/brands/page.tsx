"use client";

import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BRANDS_DATA = [
  {
    id: "1",
    name: "Sony",
    country: "Japan",
    products: 142,
    status: "Active",
    slug: "sony",
  },
  {
    id: "2",
    name: "Apple",
    country: "USA",
    products: 89,
    status: "Active",
    slug: "apple",
  },
  {
    id: "3",
    name: "Samsung",
    country: "South Korea",
    products: 215,
    status: "Active",
    slug: "samsung",
  },
  {
    id: "4",
    name: "Logitech",
    country: "Switzerland",
    products: 56,
    status: "Inactive",
    slug: "logitech",
  },
];

export default function AdminBrandsPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Brand Management
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400 mt-1">
            Define and manage authorized manufacturers in the ecosystem.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg shadow-blue-600/20">
          <Plus size={16} strokeWidth={3} />
          ADD NEW BRAND
        </button>
      </div>

      {/* Stats Overview (Matching your screenshot style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Brands", value: "124", color: "blue" },
          { label: "Active Brands", value: "118", color: "emerald" },
          { label: "Pending Review", value: "6", color: "amber" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search brands by name or country..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-600/20 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 text-xs font-black text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-xl transition-all">
            <Filter size={16} />
            FILTERS
          </button>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-800/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Brand Name
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Slug
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  HQ Location
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Products
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {BRANDS_DATA.map((brand) => (
                <tr
                  key={brand.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-gray-800/20 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-black text-xs">
                        {brand.name[0]}
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {brand.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded">
                      /{brand.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-xs font-bold">
                      <Globe size={14} />
                      {brand.country}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {brand.products} Items
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-tight",
                        brand.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-500",
                      )}
                    >
                      {brand.status === "Active" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {brand.status.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm border border-transparent hover:border-slate-200 transition-all">
                      <MoreHorizontal size={16} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
