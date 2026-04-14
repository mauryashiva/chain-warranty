"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Shield, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: any;
  onUpdate: (
    adminId: string,
    data: any,
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function EditAdminModal({
  isOpen,
  onClose,
  admin,
  onUpdate,
}: EditAdminModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        role: admin.role || "CLAIMS_AGENT",
        status: admin.status || "ACTIVE",
      });
    }
  }, [admin, isOpen]);

  if (!isOpen || !admin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await onUpdate(admin.id, {
      ...formData,
      performerId: "SYSTEM_ADMIN",
    });

    setIsSubmitting(false);
    if (result.success) onClose();
  };

  const inputClasses =
    "w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500/50 focus:ring-4 ring-blue-600/5 outline-none transition-all text-xs font-bold text-slate-800 dark:text-slate-200";

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-950 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header - Reduced bottom padding to fix the gap */}
        <div className="px-10 pt-10 pb-4 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                Edit Privileges
              </h2>
              <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-2 uppercase tracking-widest opacity-60">
                Modify governance role and identity data
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Scrollable Content - Reduced top padding */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 pt-2 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wallet Info (Read Only) */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-blue-600 shadow-sm">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  Linked Wallet Address
                </p>
                <p className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
                  {admin.walletAddress || "12222222222222222222222222222"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}>Full Name</label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    required
                    type="text"
                    className={inputClasses}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Status</label>
                <div className="relative">
                  <select
                    className={cn(
                      inputClasses,
                      "pl-4 appearance-none cursor-pointer",
                    )}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="REVOKED">REVOKED</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
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
                  className={inputClasses}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Governance Role</label>
              <div className="relative">
                <select
                  className={cn(
                    inputClasses,
                    "pl-4 appearance-none cursor-pointer",
                  )}
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
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Save size={16} />
                  Commit Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
