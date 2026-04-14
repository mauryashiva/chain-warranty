"use client";

import { useState } from "react";
import { Camera, Loader2, Send, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadToCloud } from "@/lib/storage";
interface ClaimFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  walletAddress: string; // ✅ Required for your storage path logic
}

export default function ClaimForm({
  onSubmit,
  isSubmitting: externalSubmitting,
  walletAddress,
}: ClaimFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    type: "REPAIR",
    subject: "",
    description: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please provide at least one piece of visual evidence.");
      return;
    }

    setUploading(true);

    try {
      // 1. 🛰️ Upload all files to Supabase using your storage.ts utility
      // This automatically uses the 'chain-warranty' bucket and wallet path
      const uploadPromises = files.map((file) =>
        uploadToCloud(file, walletAddress, "documents"),
      );

      const evidenceUrls = await Promise.all(uploadPromises);

      // 2. 📝 Submit form data + the generated Public URLs to your controller
      await onSubmit({
        ...formData,
        evidenceUrls,
      });

      setFiles([]); // Clear after success
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert("Protocol Initialization Failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const isProcessing = externalSubmitting || uploading;
  const labelClasses =
    "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block ml-1";
  const inputClasses =
    "w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent text-sm font-bold outline-none focus:border-blue-500/50 focus:ring-4 ring-blue-600/5 transition-all";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in duration-500"
    >
      {/* 1. PROTOCOL TYPE SELECTOR */}
      <div className="space-y-4">
        <label className={labelClasses}>Protocol Type</label>
        <div className="grid grid-cols-3 gap-4">
          {["REPAIR", "REPLACEMENT", "REFUND"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={cn(
                "py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                formData.type === type
                  ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SUBJECT & DESCRIPTION */}
      <div className="space-y-6">
        <div className="space-y-1">
          <label className={labelClasses}>Issue Subject</label>
          <input
            required
            className={inputClasses}
            placeholder="Brief title of the issue"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Detailed Description</label>
          <textarea
            required
            rows={4}
            className={cn(inputClasses, "resize-none")}
            placeholder="Describe the defect in detail..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>

      {/* 3. EVIDENCE VAULT UPLOADER */}
      <div className="space-y-4">
        <label className={labelClasses}>Visual Evidence</label>

        {/* Dynamic Preview List */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {files.map((file, i) => (
              <div
                key={i}
                className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 flex items-center gap-2"
              >
                <span className="text-[10px] font-bold text-blue-600 truncate max-w-25">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-blue-600 hover:text-rose-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative group">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
          />
          <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 group-hover:border-blue-500 transition-all bg-slate-50/50">
            <Camera
              className="text-slate-400 group-hover:text-blue-600"
              size={24}
            />
            <p className="text-[10px] font-black uppercase text-slate-400">
              Attach Evidence
            </p>
          </div>
        </div>
      </div>

      {/* 4. SECURITY INFO */}
      <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex gap-4">
        <Info className="text-blue-600 shrink-0" size={18} />
        <p className="text-[9px] font-bold text-blue-700 dark:text-blue-400 leading-relaxed uppercase tracking-widest">
          Evidence is cryptographically linked to your NFT warranty on-chain.
        </p>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            {uploading ? "Syncing Evidence..." : "Finalizing Protocol..."}
          </>
        ) : (
          <>
            <Send size={16} />
            Initialize Claim Protocol
          </>
        )}
      </button>
    </form>
  );
}
