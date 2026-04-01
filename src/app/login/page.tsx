"use client";

import ConnectWallet from "@/components/wallet/ConnectWallet";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100 dark:bg-black">
      {/* Main Login Card 
          w-87.5 is ~350px (matching your specific width requirement)
      */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 w-87.5 animate-in fade-in zoom-in-95 duration-300">
        <h1 className="text-xl font-bold mb-6 text-center text-slate-950 dark:text-white">
          Connect Wallet
        </h1>

        <div className="flex flex-col gap-4">
          {/* The SIWE logic is handled inside this component */}
          <ConnectWallet />

          <p className="text-[10px] text-center font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mt-2">
            Secure Web3 Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
