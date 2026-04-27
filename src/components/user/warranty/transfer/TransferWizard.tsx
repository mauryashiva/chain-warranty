"use client";

import React from "react";
import { useTransferWarranty } from "@/hooks/user/use-transfer-warranty";
import TransferSearch from "./TransferSearch";
import RecipientDetails from "./RecipientDetails";
import TransferReview from "./TransferReview";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TransferWizard() {
  const hook = useTransferWarranty();
  const { step, resetState } = hook;

  // Simple step indicator
  const steps = [
    { id: 1, label: "Select Warranty" },
    { id: 2, label: "Recipient Details" },
    { id: 3, label: "Review & Confirm" },
  ];

  if (step === 4) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-2">
          Transfer Complete!
        </h2>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          The warranty ownership has been successfully transferred on-chain.
        </p>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            BACK TO DASHBOARD
          </Link>
          <button
            onClick={resetState}
            className="px-6 py-3 rounded-full bg-blue-600 text-white text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition"
          >
            TRANSFER ANOTHER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-center">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black transition-colors duration-300 ${
                  step >= s.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                }`}
              >
                {s.id}
              </div>
              <span
                className={`text-[9px] uppercase tracking-widest font-black ${
                  step >= s.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 -mt-5 ${
                  step > s.id
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-200 dark:border-gray-800 p-8 shadow-sm relative overflow-hidden min-h-[500px]">
        {step === 1 && <TransferSearch hook={hook} />}
        {step === 2 && <RecipientDetails hook={hook} />}
        {step === 3 && <TransferReview hook={hook} />}
      </div>
    </div>
  );
}
