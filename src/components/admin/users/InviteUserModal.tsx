"use client";

import { useState } from "react";
import {
  X,
  UserPlus,
  Mail,
  Wallet,
  Shield,
  Loader2,
  Fingerprint,
  Lock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export default function InviteUserModal({
  isOpen,
  onClose,
  onInvite,
}: InviteUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: "",
    role: "CLAIMS_AGENT",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      walletAddress: formData.walletAddress.toLowerCase(),
      invitedBy: "SYSTEM_ADMIN",
    };

    const result = await onInvite(payload);
    setIsSubmitting(false);

    if (result.success) {
      setFormData({
        name: "",
        email: "",
        walletAddress: "",
        role: "CLAIMS_AGENT",
      });
      onClose();
    }
  };

  const inputClasses =
    "w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500/50 focus:ring-4 ring-blue-600/5 outline-none transition-all text-xs font-bold text-slate-800 dark:text-slate-200";
  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1 opacity-70";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-gray-900 bg-white dark:bg-gray-950 z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shadow-lg">
                <Fingerprint size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                  Invite Admin
                </h2>
                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-2 uppercase tracking-widest opacity-60">
                  Whitelist decentralized identity to the protocol
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-gray-900 rounded-xl transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar">
          <form onSubmit={handleSubmit} id="invite-form" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}>Full Name</label>
                <div className="relative">
                  <UserPlus
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className={inputClasses}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Email Address</label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    required
                    type="email"
                    placeholder="admin@chainwarranty.io"
                    className={inputClasses}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>MetaMask Wallet Address</label>
              <div className="relative">
                <Wallet
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  required
                  type="text"
                  placeholder="0x..."
                  className={cn(inputClasses, "font-mono")}
                  value={formData.walletAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, walletAddress: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Assign Governance Role</label>
              <div className="relative">
                <Shield
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <select
                  className={cn(inputClasses, "appearance-none cursor-pointer")}
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                  <option value="BRAND_MANAGER">BRAND MANAGER</option>
                  <option value="CLAIMS_AGENT">CLAIMS AGENT</option>
                  <option value="RETAILER_MANAGER">RETAILER MANAGER</option>
                </select>
              </div>
            </div>

            {/* Visual Permission Hint */}
            <div className="p-8 bg-slate-50 dark:bg-gray-900 rounded-4xl border border-slate-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <Lock size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Role Privileges
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <PermissionItem
                  label="Full Protocol Access"
                  active={formData.role === "SUPER_ADMIN"}
                />
                <PermissionItem
                  label="Manual Rule Overrides"
                  active={formData.role === "SUPER_ADMIN"}
                />
                <PermissionItem
                  label="Review Claims"
                  active={
                    formData.role === "SUPER_ADMIN" ||
                    formData.role === "CLAIMS_AGENT"
                  }
                />
                <PermissionItem
                  label="On-Chain Settlement"
                  active={
                    formData.role === "SUPER_ADMIN" ||
                    formData.role === "CLAIMS_AGENT"
                  }
                />
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-8 sm:p-10 border-t border-slate-50 dark:border-gray-900 bg-white dark:bg-gray-950">
          <button
            type="submit"
            form="invite-form"
            disabled={isSubmitting}
            className="w-full py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <UserPlus size={16} />
                Finalize Invitation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 transition-all duration-300",
        active ? "opacity-100" : "opacity-20",
      )}
    >
      <div
        className={cn(
          "h-5 w-5 rounded-lg flex items-center justify-center transition-colors",
          active
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            : "bg-slate-200 dark:bg-gray-800 text-transparent",
        )}
      >
        <Check size={12} strokeWidth={4} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
        {label}
      </span>
    </div>
  );
}
