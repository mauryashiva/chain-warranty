import { Search } from "lucide-react";

interface Props {
  query: string;
  setQuery: (val: string) => void;
  onValidate: (query: string) => void;
}

export default function SerialValidator({
  query,
  setQuery,
  onValidate,
}: Props) {
  return (
    <div className="max-w-3xl">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1">
        Validate a serial number
      </label>
      <div className="group relative bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl flex items-center shadow-lg shadow-slate-200/20 dark:shadow-none overflow-hidden focus-within:ring-4 ring-blue-600/10 transition-all">
        <div className="pl-6 text-slate-400">
          <Search size={18} strokeWidth={3} />
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter serial number to validate e.g. SN-2024-48291"
          className="w-full flex-1 px-4 py-5 bg-transparent outline-none font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-300"
        />
        <button
          onClick={() => onValidate(query)}
          className="mr-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[11px] uppercase tracking-widest rounded-xl hover:opacity-90 transition-all active:scale-[0.97]"
        >
          Validate
        </button>
      </div>
    </div>
  );
}
