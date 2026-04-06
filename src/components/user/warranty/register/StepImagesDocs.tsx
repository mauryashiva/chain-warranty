"use client";

import FileUpload from "./FileUpload";
import { ArrowLeft, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepImagesDocs({ data, update, onNext, onBack }: any) {
  const sectionTitleClasses =
    "text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white dark:bg-gray-900">
      {/* 💡 Information Callout */}
      <div className="flex gap-4 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 items-start">
        <div className="mt-0.5">
          <Info size={18} className="text-blue-600" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-tight">
            Verification Protocol
          </p>
          <p className="text-[11px] text-blue-700/80 dark:text-blue-300/60 leading-relaxed font-medium">
            Please upload clear, high-resolution photos. These documents will be
            cryptographically hashed and linked to your asset's blockchain
            identity for immutable proof.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* SECTION: PRODUCT IMAGES */}
        <section className="p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-8">
            <h4 className={sectionTitleClasses}>
              <ShieldCheck size={14} strokeWidth={3} />
              Visual Identification
            </h4>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FileUpload
              label="Product photo (front) *"
              icon="camera"
              type="image"
              // 🔥 Key match: frontPhoto
              onFileSelect={(file) => update({ ...data, frontPhoto: file })}
            />
            <FileUpload
              label="Product photo (back / serial) *"
              icon="camera"
              type="image"
              // 🔥 Key match: backPhoto
              onFileSelect={(file) => update({ ...data, backPhoto: file })}
            />
          </div>
        </section>

        {/* SECTION: PURCHASE DOCUMENTS */}
        <section className="p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-8">
            <h4 className={sectionTitleClasses}>
              <ShieldCheck size={14} strokeWidth={3} />
              Proof of Acquisition
            </h4>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FileUpload
              label="Invoice / Receipt *"
              icon="doc"
              type="pdf"
              // 🔥 Key match: invoiceDoc
              onFileSelect={(file) => update({ ...data, invoiceDoc: file })}
            />
            <FileUpload
              label="Warranty card / Box"
              icon="doc"
              type="pdf"
              // 🔥 Key match: warrantyCard
              onFileSelect={(file) => update({ ...data, warrantyCard: file })}
            />
          </div>
        </section>
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="flex items-center justify-between pt-10 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft
            size={16}
            strokeWidth={3}
            className="group-hover:-translate-x-1 transition-transform"
          />
          BACK
        </button>

        <button
          onClick={onNext}
          className="group flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98]"
        >
          NEXT: OWNER & CONFIRM
          <div className="bg-blue-500 rounded-lg p-1 group-hover:translate-x-1 transition-transform">
            <ArrowRight size={14} strokeWidth={3} />
          </div>
        </button>
      </div>
    </div>
  );
}
