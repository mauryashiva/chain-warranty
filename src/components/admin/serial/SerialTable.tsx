import { Loader2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SerialTable({ serials, loading, onEdit }: any) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-250">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-800">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Serial Number
              </th>
              <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Product Details
              </th>
              <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Batch
              </th>
              <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Retailer
              </th>
              <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                IMEI
              </th>
              <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Status
              </th>
              <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 text-center">
                Identity
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-gray-900">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-24 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-blue-600"
                    size={30}
                    strokeWidth={3}
                  />
                </td>
              </tr>
            ) : serials.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-24 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]"
                >
                  No serials found
                </td>
              </tr>
            ) : (
              serials.map((serial: any) => (
                <tr
                  key={serial.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-gray-900/40 transition-all duration-300 group"
                >
                  <td className="px-8 py-7">
                    <div className="flex flex-col">
                      <span className="font-mono text-[13px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter">
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
                    <p className="text-[11px] font-black uppercase text-slate-800 dark:text-slate-200 truncate max-w-37.5">
                      {serial.product?.name}
                    </p>
                    <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">
                      {serial.product?.brand?.name}
                    </p>
                  </td>
                  <td className="px-4 py-7 text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase">
                    {serial.batchId || "—"}
                  </td>
                  <td className="px-4 py-7 text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                    {serial.retailer?.name || "Warehouse"}
                  </td>
                  <td className="px-4 py-7 text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase">
                    {serial.imei || "—"}
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
                              ? "text-slate-900 dark:text-white bg-slate-200 dark:bg-white/10 border-slate-300"
                              : "text-blue-600 bg-blue-500/5 border-blue-500/10",
                      )}
                    >
                      {serial.status}
                    </span>
                  </td>
                  <td className="px-4 py-7 text-center font-mono text-[10px] text-slate-500">
                    {serial.registeredBy
                      ? `${serial.registeredBy.slice(0, 6)}...`
                      : "—"}
                  </td>
                  <td className="px-8 py-7 text-right">
                    <button
                      onClick={() => onEdit(serial)}
                      className="group/btn inline-flex items-center gap-2 bg-slate-100 dark:bg-gray-800 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all"
                    >
                      <Settings2
                        size={13}
                        className="group-hover/btn:rotate-90 transition-transform duration-500"
                      />
                      Modify
                    </button>
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
