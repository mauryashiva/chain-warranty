"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  BarChart3,
  Ban,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BulkUploadSerialsModal from "@/components/admin/serial/BulkUploadSerials";
import EditSerialModal from "@/components/admin/serial/EditSerialModal";
import { useAdminSerials } from "@/hooks/admin/use-admin-serials";

export default function AdminSerialsPage() {
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSerial, setSelectedSerial] = useState<any>(null);
  const [validateQuery, setValidateQuery] = useState("");

  const {
    serials = [],
    loading = false,
    stats = {
      total: "0",
      registered: "0",
      unregistered: "0",
      flagged: "0",
      blocked: "0",
    },
    validateSerial,
    updateSerial,
  } = useAdminSerials();

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-1";

  const handleEditClick = (serial: any) => {
    setSelectedSerial(serial);
    setIsEditOpen(true);
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateSerial(id, data);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="space-y-10 min-h-screen bg-white dark:bg-gray-900 pb-24 px-6 md:px-10 pt-4">
      {/* Modals */}
      <BulkUploadSerialsModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
      />

      {selectedSerial && (
        <EditSerialModal
          isOpen={isEditOpen}
          serial={selectedSerial}
          onClose={() => setIsEditOpen(false)}
          onSave={handleUpdate}
        />
      )}

      {/* Header Area - Left/Upper Shifted */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 dark:border-gray-800 pb-6">
        <div className="text-left">
          <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Serial Numbers
          </h3>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-[0.2em]">
            Validate and manage authorised serial numbers per product
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkOpen(true)}
            className="flex items-center gap-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-gray-700 active:scale-[0.98]"
          >
            <FileSpreadsheet size={14} strokeWidth={2.5} />
            Bulk upload CSV
          </button>
          <button className="flex items-center gap-2.5 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-[0.98]">
            <Plus size={14} strokeWidth={4} />
            Add single
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total serials",
            value: stats?.total,
            icon: <BarChart3 size={14} />,
          },
          {
            label: "Registered",
            value: stats?.registered,
            icon: <CheckCircle2 size={14} />,
          },
          {
            label: "Unregistered",
            value: stats?.unregistered,
            icon: <Search size={14} />,
          },
          {
            label: "Flagged",
            value: stats?.flagged,
            icon: <ShieldAlert size={14} />,
          },
          { label: "Blocked", value: stats?.blocked, icon: <Ban size={14} /> },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-slate-50/50 dark:bg-gray-800/30 border border-slate-100 dark:border-gray-800 p-6 rounded-3xl"
          >
            <div className="flex items-center gap-2 mb-3 opacity-60">
              <span className="text-slate-900 dark:text-white">{s.icon}</span>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                {s.label}
              </p>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {s.value || "0"}
            </p>
          </div>
        ))}
      </div>

      {/* Validation Search Bar */}
      <div className="max-w-3xl">
        <label className={labelClasses + " ml-1"}>
          Validate a serial number
        </label>
        <div className="mt-2 group relative bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl flex items-center shadow-lg shadow-slate-200/20 dark:shadow-none overflow-hidden focus-within:ring-4 ring-blue-600/10 transition-all">
          <div className="pl-6 text-slate-400">
            <Search size={18} strokeWidth={3} />
          </div>
          <input
            value={validateQuery}
            onChange={(e) => setValidateQuery(e.target.value)}
            placeholder="Enter serial number to validate e.g. SN-2024-48291"
            className="w-full flex-1 px-4 py-5 bg-transparent outline-none font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-300"
          />
          <button
            onClick={() => validateSerial(validateQuery)}
            className="mr-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[11px] uppercase tracking-widest rounded-xl hover:opacity-90 transition-all active:scale-[0.97]"
          >
            Validate
          </button>
        </div>
      </div>

      {/* Serials Table Area */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-250">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-800/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Serial Number
                </th>
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Product Details
                </th>
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Batch
                </th>
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Retailer Info
                </th>
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Status
                </th>
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 text-center">
                  Registry Identity
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-600"
                      size={30}
                      strokeWidth={3}
                    />
                  </td>
                </tr>
              ) : serials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      No serials found in registry
                    </p>
                  </td>
                </tr>
              ) : (
                serials.map((serial: any) => (
                  <tr
                    key={serial.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="px-8 py-7">
                      <div className="flex flex-col">
                        <span className="font-mono text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                          {serial.serialNumber}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                          Mfg:{" "}
                          {serial.manufactureDate
                            ? new Date(
                                serial.manufactureDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-7">
                      <p className="text-[11px] font-black uppercase text-slate-900 dark:text-white truncate max-w-37.5">
                        {serial.product?.name}
                      </p>
                      <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">
                        {serial.product?.brand?.name}
                      </p>
                    </td>
                    <td className="px-4 py-7 text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase">
                      {serial.batchId || "—"}
                    </td>
                    <td className="px-4 py-7">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                        {serial.retailer?.name || "Warehouse"}
                      </p>
                    </td>
                    <td className="px-4 py-7">
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border",
                          serial.status === "REGISTERED"
                            ? "text-emerald-600 bg-emerald-500/5 border-emerald-500/10"
                            : serial.status === "FLAGGED"
                              ? "text-rose-600 bg-rose-500/5 border-rose-500/10"
                              : serial.status === "BLOCKED"
                                ? "text-slate-950 dark:text-white bg-slate-950/10 dark:bg-white/10 border-slate-950/20 dark:border-white/20"
                                : "text-blue-600 bg-blue-500/5 border-blue-500/10",
                        )}
                      >
                        {serial.status}
                      </span>
                    </td>
                    <td className="px-4 py-7 text-center font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {serial.registeredBy
                        ? `${serial.registeredBy.slice(0, 6)}...${serial.registeredBy.slice(-4)}`
                        : "—"}
                    </td>
                    <td className="px-8 py-7 text-right">
                      <button
                        onClick={() => handleEditClick(serial)}
                        className="group/btn inline-flex items-center gap-2 bg-slate-100 dark:bg-gray-800 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all whitespace-nowrap"
                      >
                        <Settings2
                          size={13}
                          className="group-hover/btn:rotate-90 transition-transform duration-500"
                        />
                        Modify Registry
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
