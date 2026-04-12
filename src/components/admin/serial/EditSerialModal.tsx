"use client";

import { useRef, useState, useEffect } from "react";
import { X, Lock, Calendar, Loader2, Save, Info, Activity } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import SerialStatusBadge, { SerialStatus } from "./SerialStatusBadge";
import RetailerSelect from "@/components/common/Form/RetailerSelect";

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
    "w-full px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 text-xs font-bold text-slate-500 flex items-center gap-2 italic shadow-inner";
  const editableInput =
    "w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-blue-600/20 transition-all shadow-sm";
  const sectionTitleClasses =
    "text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-4 pb-2 border-b border-slate-50 dark:border-gray-800";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600 z-50" />

        {/* Header - Sticky */}
        <div className="px-10 py-7 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 shrink-0 z-40">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
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
            className="p-2.5 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full text-slate-400 transition-all active:scale-90"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
            {/* 🔒 HARDWARE IDENTITY (LOCKED) */}
            <section>
              <h3 className={sectionTitleClasses}>
                <Lock size={12} /> Hardware Identity
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className={labelClasses}>Serial Number</label>
                  <div className={lockedInput}>{serial.serialNumber}</div>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Product SKU</label>
                  <div className={lockedInput}>
                    {serial.product?.sku || "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Batch ID</label>
                  <div className={lockedInput}>
                    {serial.batchId || "GLOBAL-BATCH"}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Mfg Date</label>
                  <div className={lockedInput}>
                    {serial.manufactureDate
                      ? new Date(serial.manufactureDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </section>

            {/* ✅ LIFECYCLE MANAGEMENT (EDITABLE) */}
            <section>
              <h3 className={sectionTitleClasses}>
                <Activity size={12} /> Lifecycle & Logistics
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className={labelClasses}>Assign Retailer</label>
                    <RetailerSelect
                      value={retailerId}
                      onChange={setRetailerId}
                      placeholder="Unassigned / Warehouse"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={labelClasses}>Dispatch Date</label>
                    <div className="relative group">
                      <Calendar
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none"
                        size={14}
                      />
                      <input
                        type="date"
                        value={dispatchDate}
                        onChange={(e) => setDispatchDate(e.target.value)}
                        className={cn(
                          editableInput,
                          "pl-11 scheme-light dark:scheme-dark",
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* The Circle/ButtonGroup Section */}
                <div className="space-y-3">
                  <label className={labelClasses}>
                    Lifecycle Status Update
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                        }
                        onClick={() => setStatus(s)}
                        className={cn(
                          "py-3 rounded-xl border text-[9px] font-black uppercase tracking-tighter transition-all duration-300",
                          status === s
                            ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30 scale-[1.02]"
                            : "bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-800 text-slate-500 hover:border-blue-400 hover:text-blue-600",
                          s === "REGISTERED" &&
                            serial.status !== "REGISTERED" &&
                            "opacity-30 cursor-not-allowed grayscale",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {serial.status === "REGISTERED" && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl animate-in slide-in-from-top-1">
                      <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <Info size={12} />
                      </div>
                      <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Unit Bound to Active Warranty Registry
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Footer - Sticky */}
          <div className="px-10 py-6 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-gray-950/20 z-40">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3 disabled:opacity-50 transition-all"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Commit Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
