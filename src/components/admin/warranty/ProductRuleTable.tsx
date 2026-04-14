"use client";

import {
  Settings2,
  ArrowRightLeft,
  ShieldCheck,
  Zap,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRuleTableProps {
  products: any[];
  onEditRule: (product: any) => void;
}

export default function ProductRuleTable({
  products,
  onEditRule,
}: ProductRuleTableProps) {
  // Common text class for headers and secondary info
  const secondaryTextClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200";

  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-225">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800">
              <th className={cn("px-10 py-6", secondaryTextClasses)}>
                Model Identity
              </th>
              <th className={cn("px-6 py-6", secondaryTextClasses)}>
                Coverage Period
              </th>
              <th className={cn("px-6 py-6", secondaryTextClasses)}>
                Claim Guardrails
              </th>
              <th className={cn("px-6 py-6", secondaryTextClasses)}>
                Secondary Market
              </th>
              <th className={cn("px-10 py-6 text-right", secondaryTextClasses)}>
                Protocol Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {products.map((p) => {
              const hasOverride = !!p.warrantyRule;
              const isInactive = p.status !== "ACTIVE";

              return (
                <tr
                  key={p.id}
                  className={cn(
                    "hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-all group",
                    isInactive && "opacity-60 grayscale-30",
                  )}
                >
                  {/* 1. Identity with Policy Source & Status Badge */}
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "text-[13px] font-black uppercase tracking-tight",
                            isInactive
                              ? "text-slate-500"
                              : "text-slate-900 dark:text-white",
                          )}
                        >
                          {p.name}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isInactive && (
                            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border border-amber-500/20">
                              <Archive size={10} /> Legacy
                            </div>
                          )}

                          {hasOverride ? (
                            <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-black uppercase tracking-widest shadow-sm shadow-blue-600/20">
                              Custom
                            </span>
                          ) : (
                            <span className="text-[8px] bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">
                        {p.sku}
                      </span>
                    </div>
                  </td>

                  {/* 2. Coverage with Extension Badge */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-black text-slate-800 dark:text-slate-200 tracking-tight">
                        {p.warrantyRule?.defaultPeriod || 12} Months
                      </span>
                      {p.warrantyRule?.extendedPeriod > 0 && (
                        <div className="flex items-center gap-1 text-emerald-500 font-black uppercase">
                          <Zap size={12} strokeWidth={3} className="shrink-0" />
                          <span className="text-[9px] tracking-widest">
                            +{p.warrantyRule.extendedPeriod}M Extension
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 3. Claims Logic */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <ShieldCheck
                          size={14}
                          className="text-blue-500 shrink-0"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Max {p.warrantyRule?.maxClaimsAllowed || 3} Claims
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest ml-5.5">
                        {p.warrantyRule?.claimCooldownDays || 30} Day Cooldown
                      </span>
                    </div>
                  </td>

                  {/* 4. Transfer Protocol */}
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft
                        size={14}
                        strokeWidth={2.5}
                        className={
                          p.warrantyRule?.isTransferable !== false
                            ? "text-indigo-500"
                            : "text-slate-400"
                        }
                      />
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          p.warrantyRule?.isTransferable !== false
                            ? "text-slate-800 dark:text-slate-200"
                            : "text-slate-500",
                        )}
                      >
                        {p.warrantyRule?.isTransferable !== false
                          ? "Transferable"
                          : "Fixed Owner"}
                      </span>
                    </div>
                  </td>

                  {/* 5. Customization Button */}
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => onEditRule(p)}
                      className={cn(
                        "inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                        hasOverride
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700",
                      )}
                    >
                      <Settings2 size={14} />
                      {hasOverride ? "Modify Rule" : "Set Override"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
