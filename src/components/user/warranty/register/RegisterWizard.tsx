"use client";

import { useState } from "react";
import StepProductInfo from "./StepProductInfo";
import StepImagesDocs from "./StepImagesDocs";
import StepReviewConfirm from "./StepReviewConfirm";
import { cn } from "@/lib/utils";
import { Check, Shield } from "lucide-react";

const STEPS = ["Product info", "Images & docs", "Owner & confirm"];

export default function RegisterWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    serialNumber: "",
    imei: "",
    category: "",
    color: "",
    purchaseDate: "",
    warrantyPeriod: "2 years",
    price: "",
    retailer: "",
    invoiceNumber: "",
    country: "India",
    condition: "New",
    productId: "clp_default_prod_id",

    frontPhoto: null,
    backPhoto: null,
    invoiceDoc: null,
    warrantyCard: null,

    ownerName: "",
    ownerWallet: "",
    email: "",
    phone: "",
  });

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-top-6 duration-1000 py-8 bg-white dark:bg-gray-900">
      {/* 🚀 STEP PROGRESS INDICATOR */}
      <div className="relative max-w-2xl mx-auto px-6">
        {/* Background Line */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-300 dark:bg-gray-800 z-0" />

        {/* Active Line */}
        <div
          className="absolute top-5 left-8 h-0.5 bg-blue-600 transition-all duration-700 ease-in-out z-0 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 88}%`,
          }}
        />

        <div className="flex items-center justify-between relative z-10">
          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;

            return (
              <div
                key={step}
                className="flex flex-col items-center gap-4 group"
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 border-2",
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : isActive
                        ? "bg-white border-blue-600 text-blue-600 dark:bg-gray-900 shadow-[0_0_20px_rgba(37,99,235,0.15)] scale-110"
                        : "bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-800 dark:border-gray-700",
                  )}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={4} />
                  ) : (
                    <span className={cn(isActive && "animate-pulse")}>
                      {stepNum}
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300",
                    isActive || isCompleted
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-500",
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🛠️ STEP CONTENT */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-[3rem] p-6 md:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] dark:shadow-none relative overflow-hidden">
          {/* Glow Effects */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10">
            {currentStep === 1 && (
              <StepProductInfo
                data={formData}
                update={setFormData}
                onNext={nextStep}
              />
            )}

            {currentStep === 2 && (
              <StepImagesDocs
                data={formData}
                update={setFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 3 && (
              <StepReviewConfirm
                data={formData}
                update={setFormData}
                onBack={prevStep}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm">
            <Shield size={12} className="text-blue-600" />
            <span className="text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
              Secured On-Chain Registration
            </span>
          </div>

          <p className="text-[10px] font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">
            Step {currentStep} of {STEPS.length} • All data is encrypted before
            on-chain minting
          </p>
        </div>
      </div>
    </div>
  );
}
