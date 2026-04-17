"use client";

import { Check, Minus } from "lucide-react";

export default function PermissionMatrix() {
  const matrixData = [
    {
      perm: "Add / Edit Brands",
      super: true,
      brand: true,
      claims: false,
      retail: false,
    },
    {
      perm: "Add Products & SKUs",
      super: true,
      brand: true,
      claims: false,
      retail: false,
    },
    {
      perm: "Upload Serials",
      super: true,
      brand: true,
      claims: false,
      retail: false,
    },
    {
      perm: "Manage Retailers",
      super: true,
      brand: false,
      claims: false,
      retail: true,
    },
    {
      perm: "Review Claims",
      super: true,
      brand: false,
      claims: true,
      retail: false,
    },
    {
      perm: "Resolve On-Chain",
      super: true,
      brand: false,
      claims: true,
      retail: false,
    },
  ];

  return (
    <div className="space-y-6 mt-24">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-800 dark:text-slate-200 ml-4 opacity-70">
        System Access Control Matrix
      </h3>
      <div className="bg-white dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-[3rem] p-10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-200">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-gray-900">
                <th className="pb-8 pl-4">Permission Node</th>
                <th className="pb-8 text-center">Super Admin</th>
                <th className="pb-8 text-center">Brand Mgr</th>
                <th className="pb-8 text-center">Claims Agent</th>
                <th className="pb-8 text-center">Retail Mgr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-900">
              {matrixData.map((row, i) => (
                <tr
                  key={i}
                  className="group hover:bg-slate-50/50 dark:hover:bg-gray-900/30 transition-colors"
                >
                  <td className="py-6 pl-4 text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                    {row.perm}
                  </td>
                  <td className="py-6 text-center">
                    {row.super ? (
                      <Check
                        size={16}
                        className="mx-auto text-emerald-500"
                        strokeWidth={3}
                      />
                    ) : (
                      <Minus
                        size={16}
                        className="mx-auto text-slate-200 dark:text-slate-800"
                      />
                    )}
                  </td>
                  <td className="py-6 text-center">
                    {row.brand ? (
                      <Check
                        size={16}
                        className="mx-auto text-emerald-500"
                        strokeWidth={3}
                      />
                    ) : (
                      <Minus
                        size={16}
                        className="mx-auto text-slate-200 dark:text-slate-800"
                      />
                    )}
                  </td>
                  <td className="py-6 text-center">
                    {row.claims ? (
                      <Check
                        size={16}
                        className="mx-auto text-emerald-500"
                        strokeWidth={3}
                      />
                    ) : (
                      <Minus
                        size={16}
                        className="mx-auto text-slate-200 dark:text-slate-800"
                      />
                    )}
                  </td>
                  <td className="py-6 text-center">
                    {row.retail ? (
                      <Check
                        size={16}
                        className="mx-auto text-emerald-500"
                        strokeWidth={3}
                      />
                    ) : (
                      <Minus
                        size={16}
                        className="mx-auto text-slate-200 dark:text-slate-800"
                      />
                    )}
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
