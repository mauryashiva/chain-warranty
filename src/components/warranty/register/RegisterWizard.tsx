"use client";

import { useState } from "react";
import StepProductInfo from "./StepProductInfo";
import StepImagesDocs from "./StepImagesDocs";
import StepReviewConfirm from "./StepReviewConfirm";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = ["Product info", "Images & docs", "Owner & confirm"];

export default function RegisterWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Product Data
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

    // Step 2: File Data
    frontPhoto: null,
    backPhoto: null,
    invoiceDoc: null,
    warrantyCard: null,

    // Step 3: Owner Data
    ownerName: "",
    ownerWallet: "",
    email: "",
    phone: "",
  });

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      {/* 🚀 STEP PROGRESS INDICATOR */}
      <div className="relative max-w-3xl mx-auto px-4">
        {/* Background Connector Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 dark:bg-neutral-800 z-0" />

        {/* Active Progress Line */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500 z-0"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        <div className="flex items-center justify-between relative z-10">
          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;

            return (
              <div key={step} className="flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 border-4",
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : isActive
                        ? "bg-white border-blue-600 text-blue-600 dark:bg-neutral-950 shadow-xl"
                        : "bg-slate-50 border-slate-100 text-slate-400 dark:bg-neutral-900 dark:border-neutral-800",
                  )}
                >
                  {isCompleted ? (
                    <Check
                      size={18}
                      strokeWidth={4}
                      className="animate-in zoom-in duration-300"
                    />
                  ) : (
                    stepNum
                  )}
                </div>

                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300",
                    isActive || isCompleted
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400",
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🛠️ STEP RENDERER */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 border border-slate-200/60 dark:border-neutral-900 rounded-[2.5rem] p-8 md:p-14 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)] dark:shadow-none relative overflow-hidden">
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />

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

        {/* Helper Footer Hint */}
        <p className="mt-8 text-center text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
          Step {currentStep} of {STEPS.length} • All data is encrypted before
          on-chain minting
        </p>
      </div>
    </div>
  );
}
