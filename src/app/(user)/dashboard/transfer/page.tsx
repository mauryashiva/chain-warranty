import React from "react";
import TransferWizard from "@/components/user/warranty/transfer/TransferWizard";
import { ArrowRightLeft } from "lucide-react";

export const metadata = {
  title: "Transfer Warranty | Chain Warranty",
  description: "Transfer the ownership of your warranty to someone else securely via blockchain.",
};

export default function TransferPage() {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-inner">
            <ArrowRightLeft size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Transfer Warranty
          </h1>
        </div>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 max-w-2xl pl-13">
          Securely transfer the ownership of your digital warranty asset to a new owner. This will record a new transaction on the blockchain, and the new owner will gain full access and rights to the warranty.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <TransferWizard />
      </main>
    </div>
  );
}
