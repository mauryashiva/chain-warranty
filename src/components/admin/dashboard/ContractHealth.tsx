"use client";

import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function ContractHealth() {
  return (
    <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white flex flex-col justify-between h-full">
      <div>
        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
          <ShieldCheck className="text-blue-400" size={24} />
        </div>
        <h4 className="text-lg font-black tracking-tight">Contract Health</h4>
        <p className="text-xs font-bold text-slate-400 mt-2">
          Node connection stable. Gas prices optimal for batching.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>Network Load</span>
          <span className="text-emerald-400">12 Gwei</span>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[25%]" />
        </div>
        <button className="w-full group mt-2 flex items-center justify-center gap-2 bg-white text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
          Settings <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
