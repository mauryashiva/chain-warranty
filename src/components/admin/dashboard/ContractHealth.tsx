"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Zap,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// This would ideally come from your web3.ts or a custom hook
// For now, I'll simulate the live state logic
export default function ContractHealth() {
  const [healthData, setHealthData] = useState({
    gasPrice: 0,
    status: "SYNCING",
    loadPercentage: 0,
    isOptimal: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a fetch to Polygon/Ethereum for Gas and Node Status
    const getStats = async () => {
      setLoading(true);
      // Logic would be: const gas = await publicClient.getGasPrice()
      setTimeout(() => {
        setHealthData({
          gasPrice: 14, // Real Gwei
          status: "OPERATIONAL",
          loadPercentage: 35, // Based on network congestion
          isOptimal: true,
        });
        setLoading(false);
      }, 1500);
    };
    getStats();
  }, []);

  return (
    <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white flex flex-col justify-between h-full shadow-2xl shadow-blue-900/10 border border-white/5">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <ShieldCheck
              className={cn(
                healthData.isOptimal ? "text-emerald-400" : "text-amber-400",
              )}
              size={24}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full animate-pulse",
                healthData.isOptimal ? "bg-emerald-500" : "bg-amber-500",
              )}
            />
            <span className="text-[8px] font-black uppercase tracking-tighter text-slate-200">
              {loading ? "CHECKING..." : healthData.status}
            </span>
          </div>
        </div>

        <h4 className="text-lg font-black tracking-tight uppercase">
          Protocol Health
        </h4>
        <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed">
          {healthData.isOptimal
            ? "Node connection stable. Latency within optimal parameters for batch minting."
            : "Network congestion detected. Suggesting delay for non-critical transfers."}
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-500">Network load</span>
            <span
              className={cn(
                healthData.isOptimal ? "text-emerald-400" : "text-amber-400",
              )}
            >
              {loading ? "..." : `${healthData.gasPrice} Gwei`}
            </span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                healthData.isOptimal ? "bg-emerald-500" : "bg-amber-500",
              )}
              style={{
                width: loading ? "10%" : `${healthData.loadPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">
              Uptime
            </p>
            <p className="text-xs font-bold text-slate-200 uppercase">99.98%</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">
              Provider
            </p>
            <p className="text-xs font-bold text-slate-200 uppercase">
              Alchemy
            </p>
          </div>
        </div>

        <button className="w-full group flex items-center justify-center gap-2 bg-white text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
          Network Settings{" "}
          <ArrowUpRight
            size={14}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
