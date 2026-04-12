"use client";

import { useRef, useState, useEffect } from "react";
import { X, Lock, Store, Calendar, Loader2, Save, Info } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useAdminRetailers } from "@/hooks/admin/use-admin-retailers";
import { cn } from "@/lib/utils";
import SerialStatusBadge, { SerialStatus } from "./SerialStatusBadge";

interface EditSerialModalProps {
  isOpen: boolean;
  onClose: () => void;
  serial: any;
  onSave: (id: string, data: any) => Promise<void>;
}

export default function EditSerialModal({
  isOpen,
  onClose,
  serial,
  onSave,
}: EditSerialModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { retailers } = useAdminRetailers();
  const [isSaving, setIsSaving] = useState(false);

  // Editable States
  const [status, setStatus] = useState<SerialStatus>("UNREGISTERED");
  const [retailerId, setRetailerId] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    if (serial && isOpen) {
      setStatus(serial.status);
      setRetailerId(serial.retailerId || "");
      setDispatchDate(
        serial.dispatchDate
          ? new Date(serial.dispatchDate).toISOString().split("T")[0]
          : "",
      );
    }
  }, [serial, isOpen]);

  if (!isOpen || !serial) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(serial.id, {
        status,
        retailerId: retailerId || null,
        dispatchDate: dispatchDate ? new Date(dispatchDate) : null,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1";
  const lockedInput =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 text-xs font-bold text-slate-500 flex items-center gap-2 italic";
  const editableInput =
    "w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all shadow-sm";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-gray-800"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Serial Registry Update
              </h2>
              <SerialStatusBadge status={serial.status} />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">
              Update logistics and lifecycle status
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors text-slate-400"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* 🔒 HARDWARE IDENTITY (LOCKED) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClasses}>Serial Number (Locked)</label>
              <div className={lockedInput}>
                <Lock size={12} /> {serial.serialNumber}
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Product SKU (Locked)</label>
              <div className={lockedInput}>
                <Lock size={12} /> {serial.product?.sku || "N/A"}
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Batch ID (Locked)</label>
              <div className={lockedInput}>
                <Lock size={12} /> {serial.batchId || "GLOBAL-BATCH"}
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Mfg Date (Locked)</label>
              <div className={lockedInput}>
                <Lock size={12} />{" "}
                {serial.manufactureDate
                  ? new Date(serial.manufactureDate).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-gray-800 w-full" />

          {/* ✅ LIFECYCLE MANAGEMENT (EDITABLE) */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}>Assign Retailer</label>
                <div className="relative">
                  <Store
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                  <select
                    value={retailerId}
                    onChange={(e) => setRetailerId(e.target.value)}
                    className={cn(
                      editableInput,
                      "pl-11 appearance-none cursor-pointer",
                    )}
                  >
                    <option value="">Unassigned / Warehouse</option>
                    {retailers?.map((r: any) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Dispatch Date</label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                  <input
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className={cn(editableInput, "pl-11")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Lifecycle Status</label>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    "UNREGISTERED",
                    "REGISTERED",
                    "FLAGGED",
                    "BLOCKED",
                  ] as SerialStatus[]
                ).map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={
                      s === "REGISTERED" && serial.status !== "REGISTERED"
                    } // Prevents manual registration
                    onClick={() => setStatus(s)}
                    className={cn(
                      "py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-tighter transition-all",
                      status === s
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                        : "bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-800 text-slate-500 hover:border-blue-300",
                      s === "REGISTERED" &&
                        serial.status !== "REGISTERED" &&
                        "opacity-30 cursor-not-allowed",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {serial.status === "REGISTERED" && (
                <p className="flex items-center gap-1.5 mt-2 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                  <Info size={10} /> Active Warranty linked to this unit
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Update Serial Data
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
