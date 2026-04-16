import { FileSpreadsheet, Plus } from "lucide-react";

export default function SerialHeader({
  onBulkClick,
}: {
  onBulkClick: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 dark:border-gray-800 pb-6">
      <div className="text-left">
        <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
          Serial Numbers
        </h3>
        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight mt-2">
          Validate and manage authorised serial numbers per product
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onBulkClick}
          className="flex items-center gap-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-gray-700 active:scale-[0.98]"
        >
          <FileSpreadsheet size={14} strokeWidth={2.5} />
          Bulk upload CSV
        </button>
        <button className="flex items-center gap-2.5 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-[0.98]">
          <Plus size={14} strokeWidth={4} />
          Add single
        </button>
      </div>
    </div>
  );
}
