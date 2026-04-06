import RegisterWizard from "@/components/user/warranty/register/RegisterWizard";

export default function RegisterPage() {
  return (
    // Removed px-4 and lg:px-8 to shift everything to the far left
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-4 lg:pb-8 pt-0">
      {/* Page Header - Fully Left Aligned */}
      <div className="w-full">
        <h2 className="text-3xl font-black tracking-tighter text-slate-950 dark:text-white">
          Register New Asset
        </h2>
        <p className="mt-1 text-sm font-bold text-slate-500 dark:text-neutral-400">
          Complete the steps below to mint your blockchain-verified proof of
          ownership.
        </p>
      </div>

      {/* 🚀 The Multi-Step Wizard Component */}
      <div className="w-full">
        <RegisterWizard />
      </div>
    </div>
  );
}
