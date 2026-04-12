"use client";

import { useRef, useState, useEffect } from "react";
import {
  X,
  Store,
  Mail,
  MapPin,
  Lock,
  Link as LinkIcon,
  Tags,
  CheckCircle2,
  Loader2,
  Save,
  Briefcase,
  Contact,
  Building2,
  Ban,
  Activity,
  PowerOff,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";
import { countryOptions } from "@/components/common/countries";
import { cn } from "@/lib/utils";
import RetailerStatusBadge from "./RetailerStatusBadge"; // Importing your existing badge component
import LocationSelector from "@/components/common/Form/LocationSelector";

interface EditRetailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  retailer: any;
  onSave: (id: string, data: any) => Promise<void>;
}

export default function EditRetailerModal({
  isOpen,
  onClose,
  retailer,
  onSave,
}: EditRetailerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { brands } = useAdminBrands();

  const [isSaving, setIsSaving] = useState(false);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [status, setStatus] = useState<any>("ACTIVE");

  const [locationValues, setLocationValues] = useState({
    phoneCode: "+91",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
  });

  const handleLocationChange = (field: string, value: string) => {
    setLocationValues((prev) => ({ ...prev, [field]: value }));
  };

  useClickOutside(modalRef, () => {
    onClose();
  });

  useEffect(() => {
    if (retailer && isOpen) {
      setSelectedBrandIds(
        retailer.brandIds || retailer.brands?.map((b: any) => b.id) || [],
      );
      setStatus(retailer.status || "ACTIVE");

      let pCode = "+91";
      let pNum = "";
      if (retailer.contactPhone && retailer.contactPhone.includes(" ")) {
        const parts = retailer.contactPhone.split(" ");
        pCode = parts[0];
        pNum = parts[1];
      }

      setLocationValues({
        phoneCode: pCode,
        phoneNumber: pNum,
        country: retailer.country || "",
        state: retailer.state || "",
        city: retailer.city || "",
      });
    }
  }, [retailer, isOpen]);

  if (!isOpen || !retailer) return null;

  const toggleBrand = (brandId: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    setIsSaving(true);
    try {
      await onSave(retailer.id, {
        ...data,
        ...locationValues,
        status,
        contactPhone: `${locationValues.phoneCode} ${locationValues.phoneNumber}`,
        brandIds: selectedBrandIds,
      });
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2 block ml-1";
  const lockedInput =
    "w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-slate-100 dark:border-gray-800 text-[11px] font-bold text-slate-400 flex items-center gap-2 italic cursor-not-allowed shadow-inner";
  const editableInput =
    "w-full px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-gray-800 border-none text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all appearance-none";
  const sectionHeader =
    "flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-gray-800";
  const sectionTitle =
    "text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-gray-800 animate-in zoom-in-95"
      >
        {/* Header with Live Status Badge */}
        <div className="px-10 py-8 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between bg-slate-50/30 dark:bg-gray-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Store size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                Modify Retailer
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Partner ID: {retailer.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* 🟢 Live Status Badge in Header */}
            <RetailerStatusBadge status={status} />
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-400" strokeWidth={3} />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-10 space-y-12 overflow-y-auto max-h-[75vh] custom-scrollbar"
        >
          {/* GLOBAL STATUS TOGGLE BUTTONS */}
          <section className="bg-slate-50 dark:bg-gray-800/40 p-6 rounded-[2.5rem] border border-slate-100 dark:border-gray-800">
            <label className={labelClasses}>
              Update Partner Lifecycle Status
            </label>
            <div className="flex gap-3 mt-4">
              {[
                {
                  id: "ACTIVE",
                  label: "Active",
                  icon: Activity,
                  color: "text-emerald-600",
                  bg: "bg-emerald-500/10",
                  activeBg: "bg-emerald-600",
                },
                {
                  id: "INACTIVE",
                  label: "Inactive",
                  icon: PowerOff,
                  color: "text-amber-600",
                  bg: "bg-amber-500/10",
                  activeBg: "bg-amber-600",
                },
                {
                  id: "SUSPENDED",
                  label: "SUSPENDED",
                  icon: Ban,
                  color: "text-rose-600",
                  bg: "bg-rose-500/10",
                  activeBg: "bg-rose-600",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2",
                    status === item.id
                      ? `${item.activeBg} border-transparent text-white shadow-lg shadow-${item.id === "ACTIVE" ? "emerald" : item.id === "INACTIVE" ? "amber" : "rose"}-600/20`
                      : `${item.bg} border-transparent ${item.color} hover:border-slate-200 dark:hover:border-gray-700`,
                  )}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 1: PROTECTED IDENTITY */}
          <section>
            <div className={sectionHeader}>
              <Lock size={14} className="text-blue-600" />
              <h3 className={sectionTitle}>Protected Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}>Retailer Slug</label>
                <div className={lockedInput}>{retailer.slug}</div>
              </div>
              <div className="space-y-1">
                <label className={labelClasses}>GST / Tax ID</label>
                <div className={lockedInput}>
                  {retailer.gstNumber || "UNAVAILABLE"}
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClasses}>PAN Card</label>
                <div className={lockedInput}>
                  {retailer.panNumber || "UNAVAILABLE"}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: COMMUNICATIONS */}
          <section>
            <div className={sectionHeader}>
              <Contact size={14} className="text-blue-600" />
              <h3 className={sectionTitle}>Communications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2 space-y-1">
                <label className={labelClasses}>Retailer Display Name</label>
                <input
                  name="name"
                  defaultValue={retailer.name}
                  className={cn(editableInput, "cursor-text")}
                />
              </div>
              <div className="lg:col-span-2 space-y-1">
                <label className={labelClasses}>Primary Email</label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="contactEmail"
                    defaultValue={retailer.contactEmail}
                    className={cn(editableInput, "pl-12 cursor-text")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: BUSINESS PRESENCE */}
          <section>
            <div className={sectionHeader}>
              <Building2 size={14} className="text-blue-600" />
              <h3 className={sectionTitle}>Business Presence</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
              <div className="col-span-1 md:col-span-4">
                <LocationSelector
                  fields={["phone", "country", "state", "city"]}
                  values={locationValues}
                  onChange={handleLocationChange}
                />
              </div>

              <div className="md:col-span-1 space-y-1">
                <label className={labelClasses}>Business Type</label>
                <select
                  name="type"
                  defaultValue={retailer.type}
                  className={cn(editableInput, "w-full cursor-pointer")}
                >
                  <option value="ONLINE">Online Store</option>
                  <option value="OFFLINE">Brick & Mortar</option>
                  <option value="BOTH">Omnichannel</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className={labelClasses}>Official Website</label>
                <div className="relative">
                  <LinkIcon
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="website"
                    defaultValue={retailer.website}
                    className={cn(editableInput, "pl-12 cursor-text")}
                  />
                </div>
              </div>

              <div className="md:col-span-1 space-y-1">
                <label className={labelClasses}>PIN / Zip Code</label>
                <div className="relative">
                  <Lock
                    size={12}
                    className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400",
                      locationValues.city && "hidden",
                    )}
                  />
                  <input
                    name="pinCode"
                    defaultValue={retailer.pinCode}
                    placeholder={
                      locationValues.city ? "Zip Code" : "Select city..."
                    }
                    disabled={!locationValues.city}
                    className={cn(
                      editableInput,
                      !locationValues.city &&
                        "pl-10 opacity-50 cursor-not-allowed",
                    )}
                  />
                </div>
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className={labelClasses}>Full Operational Address</label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-4 top-4 text-slate-400"
                  />
                  <textarea
                    name="address"
                    defaultValue={retailer.address}
                    rows={2}
                    className={cn(
                      editableInput,
                      "pl-12 resize-none h-auto py-4",
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: PERMISSIONS */}
          <section>
            <div className={sectionHeader}>
              <Tags size={14} className="text-blue-600" />
              <h3 className={sectionTitle}>Brand Authorizations</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {brands
                ?.filter((b) => b.status === "ACTIVE")
                .map((brand: any) => {
                  const isSelected = selectedBrandIds.includes(brand.id);
                  const flagIso = countryOptions
                    .find((c) => c.country === brand.country)
                    ?.iso.toLowerCase();
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => toggleBrand(brand.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-2xl border transition-all relative group",
                        isSelected
                          ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20"
                          : "bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-800 hover:border-blue-400",
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shrink-0">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span
                            className={cn(
                              "font-black text-xs",
                              isSelected ? "text-blue-600" : "text-slate-400",
                            )}
                          >
                            {brand.name[0]}
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase truncate",
                          isSelected
                            ? "text-white"
                            : "text-slate-800 dark:text-slate-200",
                        )}
                      >
                        {brand.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2
                          size={12}
                          className="absolute -top-1.5 -right-1.5 text-blue-600 bg-white rounded-full border-2 border-white"
                        />
                      )}
                    </button>
                  );
                })}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-[11px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-[0.2em] transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Commit Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
