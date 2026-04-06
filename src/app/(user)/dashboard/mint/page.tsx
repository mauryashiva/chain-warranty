import MintingPanel from "@/components/user/warranty/MintingPanel";
import { Zap } from "lucide-react";

export default function MintPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 lg:p-8">
      {/* Page Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
          <Zap size={18} strokeWidth={3} fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Contract Interaction
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white">
          Mint Warranty NFT
        </h1>
        <p className="mt-3 text-base font-bold text-slate-500 dark:text-neutral-400 leading-relaxed">
          Authorized personnel only. This tool directly interacts with the{" "}
          <span className="text-blue-600">ChainWarranty v1</span> Smart Contract
          to generate new ERC-721 tokens.
        </p>
      </div>

      <MintingPanel />
    </div>
  );
}
