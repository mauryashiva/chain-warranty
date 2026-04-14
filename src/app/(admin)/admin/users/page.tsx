"use client";

import { useState } from "react";
import { Search, RefreshCcw } from "lucide-react";
import { useAdminUsers } from "@/hooks/admin/use-admin-users";
import { cn } from "@/lib/utils";

// ✅ Sub-components
import InviteUserModal from "@/components/admin/users/InviteUserModal";
import EditAdminModal from "@/components/admin/users/EditAdminModal";
import UserHeader from "@/components/admin/users/UserHeader";
import UserTable from "@/components/admin/users/UserTable";
import PermissionMatrix from "@/components/admin/users/PermissionMatrix";

export default function AdminUsersPage() {
  const { admins, loading, refresh, inviteAdmin, updateAdmin, revokeAdmin } =
    useAdminUsers() as any;

  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const filteredUsers = (admins || []).filter(
    (u: any) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.walletAddress?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEditClick = (user: any) => {
    setSelectedAdmin(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (adminId: string) => {
    if (
      confirm("Are you sure you want to revoke this administrator's access?")
    ) {
      await revokeAdmin(adminId);
    }
  };

  // ✅ Boolean to check if any modal is active
  const isAnyModalOpen = isInviteModalOpen || isEditModalOpen;

  return (
    <div className="relative min-h-screen">
      {/* 1. MAIN CONTENT LAYER 
         We force this layer to stay below the modals using z-0 or relative 
      */}
      <div
        className={cn(
          "space-y-12 pb-24 px-6 md:px-10 pt-8 max-w-400 mx-auto animate-in fade-in duration-700",
          isAnyModalOpen
            ? "pointer-events-none opacity-40 grayscale-[0.5] blur-[2px] transition-all duration-500"
            : "opacity-100 blur-0",
        )}
      >
        <UserHeader onInviteClick={() => setIsInviteModalOpen(true)} />

        {/* --- SEARCH & SYNC --- */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
          <div className="relative w-full md:w-112.5 group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Name, Email or Wallet..."
              className="w-full pl-14 pr-4 py-4 rounded-3xl bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-4 ring-blue-600/5 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => refresh()}
            className="flex items-center gap-2 px-6 py-4 bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 font-black text-[10px] uppercase tracking-widest group shadow-sm active:scale-95"
          >
            <RefreshCcw
              size={14}
              className="group-active:rotate-180 transition-transform duration-500"
            />
            Synchronize
          </button>
        </div>

        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <PermissionMatrix />
      </div>

      {/* 2. MODALS LAYER 
         Keep these at the bottom of the JSX and ensure high Z-index in component 
      */}
      {isInviteModalOpen && (
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={inviteAdmin}
        />
      )}

      {isEditModalOpen && (
        <EditAdminModal
          isOpen={isEditModalOpen}
          admin={selectedAdmin}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAdmin(null);
          }}
          onUpdate={updateAdmin}
        />
      )}
    </div>
  );
}
