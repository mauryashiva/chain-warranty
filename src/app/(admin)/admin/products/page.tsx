"use client";

import {
  Box,
  Plus,
  Search,
  Filter,
  Layers,
  DollarSign,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCTS_DATA = [
  {
    id: "1",
    name: "WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    sku: "SONY-WH1XM5",
    years: 2,
    price: "$250–$380",
    status: "Active",
  },
  {
    id: "2",
    name: "Galaxy S24",
    brand: "Samsung",
    category: "Smartphone",
    sku: "SAM-S24-256",
    years: 1,
    price: "$800–$1,100",
    status: "Active",
  },
  {
    id: "3",
    name: "XPS 15 9530",
    brand: "Dell",
    category: "Laptop",
    sku: "DELL-XPS15-9530",
    years: 2,
    price: "$1,500–$2,200",
    status: "Active",
  },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Products
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
            All product models eligible for warranty registration
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-950 dark:bg-white dark:text-black text-white px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-xl">
          <Plus size={16} strokeWidth={3} /> ADD PRODUCT
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-gray-800 flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl text-xs font-bold outline-none"
            />
          </div>
          <select className="bg-slate-50 dark:bg-gray-800 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border-none">
            <option>All Brands</option>
          </select>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-gray-800/30">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Warranty (Yrs)</th>
              <th className="px-6 py-4">Price Range</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {PRODUCTS_DATA.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-slate-50/50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800">
                      <Box size={16} className="text-slate-500" />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs font-bold text-slate-600 dark:text-gray-400">
                  {p.brand}
                </td>
                <td className="px-6 py-5 text-xs font-bold text-slate-600 dark:text-gray-400">
                  {p.category}
                </td>
                <td className="px-6 py-5">
                  <code className="text-[10px] font-bold bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {p.sku}
                  </code>
                </td>
                <td className="px-6 py-5 text-xs font-black text-slate-900 dark:text-white">
                  {p.years}Y
                </td>
                <td className="px-6 py-5 text-xs font-bold text-slate-600 dark:text-gray-400">
                  {p.price}
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-[9px] font-black uppercase tracking-widest">
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button className="text-[10px] font-black text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-[10px] font-black text-slate-400 hover:underline">
                    Serials
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
