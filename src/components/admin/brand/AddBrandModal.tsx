"use client";

import { useRef, useState } from "react";
import {
  X,
  Mail,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import LocationRoot, {
  CountryField,
  PhoneField,
} from "@/components/common/Form/LocationSelector";

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
}

export default function AddBrandModal({
  isOpen,
  onClose,
  onSave,
}: AddBrandModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [locationValues, setLocationValues] = useState({
    phoneCode: "+91",
    phoneNumber: "",
    country: "",
  });

  const handleLocationChange = (field: string, value: string) =>
    setLocationValues((prev) => ({ ...prev, [field]: value }));
  useClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1";

  // ✅ ADDED h-[46px] TO MATCH THE LOCATION SELECTOR EXACTLY
  const inputClasses =
    "w-full px-4 h-[46px] rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-500/10 shadow-sm flex items-center";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    if (!locationValues.country) {
      alert("Please select a Country of Origin");
      return;
    }
    data.country = locationValues.country;
    data.supportPhone = locationValues.phoneNumber
      ? `${locationValues.phoneCode} ${locationValues.phoneNumber}`
      : "";
    await onSave(data);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-indigo-500" />
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between bg-white dark:bg-gray-900 relative">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
              Register Brand Identity
            </h2>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
              Initialize a new manufacturer in the catalog.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 transition-all active:scale-95"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <form
          id="brandForm"
          onSubmit={handleSubmit}
          className="p-8 overflow-y-auto max-h-[65vh] custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <label className={labelClasses}>Brand Name *</label>
              <input
                name="name"
                required
                placeholder="e.g. Sony"
                className={inputClasses}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Brand Slug *</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">
                  /
                </span>
                <input
                  name="slug"
                  required
                  placeholder="sony"
                  className={cn(inputClasses, "pl-8 lowercase")}
                />
              </div>
            </div>

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
                  />
                  <input
                    name="website"
                    type="url"
                    placeholder="https://sony.com"
                    className={cn(inputClasses, "pl-12")}
                  />
                </div>
              </div>
              <PhoneField label="Support Phone" className="md:col-span-1" />
            </LocationRoot>

            <div className="space-y-1">
              <label className={labelClasses}>Support Email</label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  name="supportEmail"
                  type="email"
                  placeholder="support@sony.com"
                  className={cn(inputClasses, "pl-12")}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>GST / Tax ID</label>
              <div className="relative group">
                <FileText
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  name="taxId"
                  placeholder="Tax ID"
                  className={cn(inputClasses, "pl-12")}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Brand Logo URL</label>
              <div className="relative group">
                <ImageIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  name="logoUrl"
                  type="url"
                  placeholder="https://..."
                  className={cn(inputClasses, "pl-12")}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-1 pt-2">
              <label className={labelClasses}>Brand Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Description..."
                className={cn(inputClasses, "resize-none h-auto py-4")}
              />
            </div>
          </div>
        </form>

        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-end gap-3 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 text-[11px] font-black text-slate-800 dark:text-slate-200 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="brandForm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
          >
            Save Brand
          </button>
        </div>
      </div>
    </div>
  );
}
