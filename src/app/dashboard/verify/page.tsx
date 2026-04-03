import VerifySearch from "@/components/warranty/VerifySearch";
import { BadgeCheck } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3">
          <BadgeCheck size={20} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Public Ledger Check
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white">
          Verify Warranty
        </h1>
        <p className="mt-4 text-base font-bold text-slate-500 dark:text-neutral-400 leading-relaxed">
          Instantly validate the authenticity and expiration status of any
          product warranty using its unique blockchain token ID.
        </p>
      </div>

      <VerifySearch />

      {/* Trust Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t-2 border-gray-100 dark:border-neutral-900">
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight">
            How it works
          </h4>
          <p className="text-xs font-bold text-slate-500 leading-relaxed">
            Every warranty issued on ChainWarranty is minted as an NFT. When you
            search an ID, we cross-reference the blockchain record with our
            secure database to ensure the asset hasn't been tampered with or
            expired.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight">
            QR Verification
          </h4>
          <p className="text-xs font-bold text-slate-500 leading-relaxed">
            Scanning a physical QR code on a product will automatically route
            you to this verification portal with the Token ID pre-filled for a
            seamless experience.
          </p>
        </div>
      </div>
    </div>
  );
}
