import RegisterForm from "@/components/warranty/RegisterForm";
import { ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
          <ShieldCheck size={20} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Direct Minting
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white">
          Register New Asset
        </h1>
        <p className="mt-3 text-base font-bold text-slate-500 dark:text-neutral-400 leading-relaxed">
          Initialize a new blockchain-verified warranty for your product. Ensure
          all details are correct as they will be written permanently to the
          ledger.
        </p>
      </div>

      {/* Form Area */}
      <RegisterForm />
    </div>
  );
}
