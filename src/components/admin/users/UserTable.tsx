"use client";

import { Wallet, Edit3, UserMinus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: any[];
  loading: boolean;
  onEdit: (user: any) => void; // Handler for the Blue Edit Button
  onDelete: (adminId: string) => void; // Handler for the Red Revoke Button
}

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
}: UserTableProps) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-250">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Name / Email
              </th>
              <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Role
              </th>
              <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Wallet Identity
              </th>
              <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Status
              </th>
              <th className="px-10 py-7 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-gray-900">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Syncing User Registry...
                    </p>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    No administrators found
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-gray-900/40 transition-all duration-300 group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-gray-800 border border-slate-200/50 dark:border-gray-800 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm group-hover:border-blue-500/30 transition-colors">
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight leading-none">
                          {user.name || "Unknown Admin"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 tabular-nums opacity-80">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 shadow-sm shadow-blue-500/5">
                      {user.role?.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-6 tabular-nums">
                    <div
                      title={user.walletAddress}
                      className="flex items-center gap-2 font-mono text-[10px] text-slate-800 dark:text-slate-400 font-bold hover:text-blue-600 transition-colors cursor-help"
                    >
                      <Wallet
                        size={12}
                        className="text-slate-400 group-hover:text-blue-500"
                      />
                      {user.walletAddress?.slice(0, 6)}...
                      {user.walletAddress?.slice(-4)}
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full transition-all duration-500",
                          user.status === "ACTIVE"
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]",
                        )}
                      />
                      <span className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                        {user.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* 🔵 Edit Button */}
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2.5 bg-slate-50 dark:bg-gray-900 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-slate-400 border border-slate-200/50 dark:border-gray-800 shadow-sm active:scale-90"
                      >
                        <Edit3 size={15} />
                      </button>

                      {/* 🔴 Revoke Button */}
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-2.5 bg-slate-50 dark:bg-gray-900 hover:bg-rose-600 hover:text-white rounded-xl transition-all text-slate-400 border border-slate-200/50 dark:border-gray-800 shadow-sm active:scale-90"
                      >
                        <UserMinus size={15} />
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
