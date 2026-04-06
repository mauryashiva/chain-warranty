"use client";

import { useAdminUsers } from "@/hooks/admin/use-admin-users";
import {
  UserPlus,
  ShieldCheck,
  Mail,
  Wallet,
  MoreHorizontal,
  UserCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PERMISSIONS = [
  {
    action: "Add / edit brands",
    super: true,
    brand: true,
    claims: false,
    retailer: false,
  },
  {
    action: "Add products & SKUs",
    super: true,
    brand: true,
    claims: false,
    retailer: false,
  },
  {
    action: "Upload serials",
    super: true,
    brand: true,
    claims: false,
    retailer: false,
  },
  {
    action: "Manage retailers",
    super: true,
    brand: false,
    claims: false,
    retailer: true,
  },
  {
    action: "Review claims",
    super: true,
    brand: false,
    claims: true,
    retailer: false,
  },
  {
    action: "Resolve claims on-chain",
    super: true,
    brand: false,
    claims: true,
    retailer: false,
  },
];

export default function AdminUsersPage() {
  const { admins, loading } = useAdminUsers();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Admin Users
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
            Manage admin roles and access permissions.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs shadow-lg shadow-blue-600/20">
          <UserPlus size={16} strokeWidth={3} /> INVITE ADMIN
        </button>
      </div>

      {/* 01. ADMIN LIST TABLE */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-gray-800/30">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-5">Name / Email</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Wallet Address</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {admins.map((admin: any) => (
              <tr
                key={admin.id}
                className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                      {admin.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">
                        {admin.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 lowercase">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  {admin.role.replace("_", " ")}
                </td>
                <td className="px-8 py-6 font-mono text-[10px] text-blue-600">
                  {admin.wallet.slice(0, 12)}...
                </td>
                <td className="px-8 py-6">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-[9px] font-black uppercase">
                    Active
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase">
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 02. ROLE PERMISSIONS MATRIX (Industry Standard UI) */}
      <section className="space-y-6 pt-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
          Role Permissions Matrix
        </h3>
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left text-[11px] font-bold">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-800/30 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-4">Permission</th>
                <th className="px-4 py-4 text-center">Super Admin</th>
                <th className="px-4 py-4 text-center">Brand Mgr</th>
                <th className="px-4 py-4 text-center">Claims Agent</th>
                <th className="px-4 py-4 text-center">Retailer Mgr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {PERMISSIONS.map((p) => (
                <tr key={p.action}>
                  <td className="px-8 py-4 text-slate-900 dark:text-white">
                    {p.action}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {p.super && (
                      <Check size={14} className="mx-auto text-emerald-500" />
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {p.brand && (
                      <Check size={14} className="mx-auto text-emerald-500" />
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {p.claims && (
                      <Check size={14} className="mx-auto text-emerald-500" />
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {p.retailer && (
                      <Check size={14} className="mx-auto text-emerald-500" />
                    )}
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
