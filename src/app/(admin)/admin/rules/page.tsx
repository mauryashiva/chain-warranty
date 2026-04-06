"use client";

import {
  Settings,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  Laptop,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GLOBAL_RULES = [
  {
    id: "1",
    label: "Allow registration after purchase",
    desc: "Control max days after purchase to register",
    value: "Enabled",
    meta: "30 days",
  },
  {
    id: "2",
    label: "Allow transfer of warranty",
    desc: "Owner can transfer NFT to new buyer",
    value: "Enabled",
    meta: "OTP Required",
  },
  {
    id: "3",
    label: "Allow transfer when claim is open",
    desc: "Transfer blocked if active claim exists",
    value: "Disabled",
    meta: "Security",
  },
  {
    id: "4",
    label: "Auto-expire NFT after warranty end",
    desc: "NFT status updates on-chain after expiry",
    value: "Enabled",
    meta: "On-Chain",
  },
];

const PRODUCT_OVERRIDES = [
  {
    product: "WH-1000XM5",
    brand: "Sony",
    default: "2 yr",
    extended: "+1 yr optional",
    claims: "2 max",
    icon: Headphones,
  },
  {
    product: "Galaxy S24",
    brand: "Samsung",
    default: "1 yr",
    extended: "+1 yr optional",
    claims: "3 max",
    icon: Smartphone,
  },
  {
    product: "XPS 15 9530",
    brand: "Dell",
    default: "2 yr",
    extended: "+2 yr optional",
    claims: "2 max",
    icon: Laptop,
  },
];

export default function AdminRulesPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Warranty Rules
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
            Configure global and per-product warranty policies.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-950 dark:bg-white dark:text-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
          <RefreshCw size={14} /> Sync with Smart Contract
        </button>
      </div>

      {/* 01. GLOBAL SETTINGS */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
          Global Settings
        </h3>
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden">
          {GLOBAL_RULES.map((rule, i) => (
            <div
              key={rule.id}
              className={cn(
                "p-8 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                i !== GLOBAL_RULES.length - 1 &&
                  "border-b border-slate-100 dark:border-gray-800",
              )}
            >
              <div className="max-w-xl">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {rule.label}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  {rule.desc}
                </p>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {rule.meta}
                </span>
                <button
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    rule.value === "Enabled"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  {rule.value}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02. PER-PRODUCT OVERRIDES */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
          Per-Product Overrides
        </h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-gray-800">
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Default Warranty</th>
                <th className="px-8 py-5">Extended Warranty</th>
                <th className="px-8 py-5">Max Claims</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {PRODUCT_OVERRIDES.map((item) => (
                <tr
                  key={item.product}
                  className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-500">
                        <item.icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          {item.product}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {item.brand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-black text-slate-900 dark:text-white">
                    {item.default}
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-blue-600">
                    {item.extended}
                  </td>
                  <td className="px-8 py-6 text-xs font-black text-slate-900 dark:text-white">
                    {item.claims}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest">
                      Edit Policy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
