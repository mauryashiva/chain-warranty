"use client";

import { useRef, useState, useEffect } from "react";
import {
  X,
  Mail,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Lock,
  Loader2,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import StatusToggle from "./StatusToggle";
// 🌍 Import the Advanced Composable Components
import LocationRoot, {
  CountryField,
  PhoneField,
} from "@/components/common/Form/LocationSelector";

interface EditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void> | void;
  brand: any;
}

export default function EditBrandModal({
  isOpen,
  onClose,
  onSave,
  brand,
}: EditBrandModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // States
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [isSaving, setIsSaving] = useState(false);

  // 🌍 Composable Location State
  const [locationValues, setLocationValues] = useState({
    phoneCode: "+91",
    phoneNumber: "",
    country: "",
  });

  const handleLocationChange = (field: string, value: string) => {
    setLocationValues((prev) => ({ ...prev, [field]: value }));
  };

  // Sync brand data to state
  useEffect(() => {
    if (brand && isOpen) {
      setStatus(
        brand.status?.toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE",
      );

      let pCode = "+91";
      let pNum = "";
      if (brand.supportPhone && brand.supportPhone.includes(" ")) {
        const parts = brand.supportPhone.split(" ");
        pCode = parts[0];
        pNum = parts.slice(1).join(" ");
      }

      setLocationValues({
        phoneCode: pCode,
        phoneNumber: pNum,
        country: brand.country || "",
      });
    }
  }, [brand, isOpen]);

  useClickOutside(modalRef, onClose);

  if (!isOpen || !brand) return null;

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1";

  // Force strict height h-[46px] for pixel-perfect alignment
  const inputClasses =
    "w-full px-4 h-[46px] rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-500/10 shadow-sm flex items-center";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const finalData = {
      ...data,
      country: locationValues.country,
      supportPhone: locationValues.phoneNumber
        ? `${locationValues.phoneCode} ${locationValues.phoneNumber}`
        : "",
      status: status,
    };

    delete (finalData as any).rawPhone;

    setIsSaving(true);
    try {
      await onSave(brand.id, finalData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-indigo-500" />

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between bg-white dark:bg-gray-900 z-10 relative">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
              Edit Brand Identity
            </h2>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
              Modify manufacturer profile and system status in the catalog.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all active:scale-95"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <form
          id="editBrandForm"
          onSubmit={handleSubmit}
          className="p-8 overflow-y-auto max-h-[65vh] custom-scrollbar"
        >
          {/* Status Section */}
          <div className="mb-8 flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">
                Account Status
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
                Control brand visibility across the registry
              </p>
            </div>
            <StatusToggle value={status} onChange={setStatus} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Brand Name */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand Name *</label>
              <input
                name="name"
                defaultValue={brand.name}
                required
                className={inputClasses}
              />
            </div>

            {/* Brand Slug (Locked) */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand Slug (Locked)</label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  value={brand.slug}
                  disabled
                  className={cn(
                    inputClasses,
                    "pl-10 opacity-60 cursor-not-allowed italic bg-gray-100/50 dark:bg-gray-800/50 h-11.5",
                  )}
                />
              </div>
            </div>

            {/* 🌍 Advanced Composable Location Fields */}
            <LocationRoot
              values={locationValues}
              onChange={handleLocationChange}
            >
              <CountryField
                label="Country of Origin *"
                className="md:col-span-1"
              />

              <div className="space-y-1">
                <label className={labelClasses}>Official Website</label>
                <div className="relative group">
                  <LinkIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                    strokeWidth={2.5}
                  />
                  <input
                    name="website"
                    type="url"
                    defaultValue={brand.website}
                    placeholder="https://sony.com"
                    className={cn(inputClasses, "pl-12 h-11.5")}
                  />
                </div>
              </div>

              <PhoneField label="Support Phone" className="md:col-span-1" />
            </LocationRoot>

            {/* Support Email */}
            <div className="space-y-1">
              <label className={labelClasses}>Support Email</label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                  strokeWidth={2.5}
                />
                <input
                  name="supportEmail"
                  type="email"
                  defaultValue={brand.supportEmail}
                  placeholder="support@sony.com"
                  className={cn(inputClasses, "pl-12 h-11.5")}
                />
              </div>
            </div>

            {/* Tax ID */}
            <div className="space-y-1">
              <label className={labelClasses}>GST / Tax ID</label>
              <div className="relative group">
                <FileText
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                  strokeWidth={2.5}
                />
                <input
                  name="taxId"
                  defaultValue={brand.taxId}
                  placeholder="Tax Identification Number"
                  className={cn(inputClasses, "pl-12 h-11.5")}
                />
              </div>
            </div>

            {/* Brand Logo URL */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand Logo URL</label>
              <div className="relative group">
                <ImageIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                  strokeWidth={2.5}
                />
                <input
                  name="logoUrl"
                  type="url"
                  defaultValue={brand.logoUrl}
                  placeholder="https://..."
                  className={cn(inputClasses, "pl-12 h-11.5")}
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1 pt-2">
              <label className={labelClasses}>Brand Description</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={brand.description}
                placeholder="Briefly describe the brand..."
                className={cn(
                  inputClasses,
                  "resize-none font-medium h-auto py-4",
                )}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-end gap-3 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 text-[11px] font-black text-slate-800 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="editBrandForm"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <Loader2 className="animate-spin" size={14} />}
            Update Brand
          </button>
        </div>
      </div>
    </div>
  );
}
