"use client";

import { useState, useRef } from "react";
import { Camera, FileText, X, UploadCloud, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  type: "image" | "pdf";
  onFileSelect: (file: File | null) => void;
  icon: "camera" | "doc";
}

export default function FileUpload({
  label,
  type,
  onFileSelect,
  icon,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview("pdf-detected"); // Placeholder for PDF icons
      }
    }
  };

  const clearFile = () => {
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="group space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </label>
        {preview && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
            <CheckCircle2 size={12} />
            Ready
          </span>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative h-44 w-full cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden",
          preview
            ? "border-blue-500 bg-blue-50/10 shadow-inner"
            : "border-slate-200 bg-slate-50/30 hover:border-blue-400 hover:bg-blue-50/20 dark:border-neutral-800 dark:bg-neutral-950/50",
        )}
      >
        {preview ? (
          <div className="relative h-full w-full group/preview">
            {preview === "pdf-detected" ? (
              <div className="flex h-full w-full animate-in fade-in zoom-in-95 duration-300 flex-col items-center justify-center gap-3 bg-white dark:bg-neutral-900">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                  <FileText size={32} className="text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    Document Attached
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Ready for verification
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full animate-in fade-in duration-500">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover/preview:opacity-0" />
              </div>
            )}

            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="absolute right-3 top-3 z-10 rounded-xl bg-white/90 p-2 text-slate-900 shadow-xl backdrop-blur-md transition-all hover:bg-red-500 hover:text-white dark:bg-neutral-900/90 dark:text-white"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition-all group-hover:scale-110 group-hover:text-blue-600 group-hover:ring-blue-200 dark:bg-neutral-900 dark:ring-neutral-800 dark:group-hover:ring-blue-900">
              {icon === "camera" ? (
                <Camera size={24} strokeWidth={1.5} />
              ) : (
                <FileText size={24} strokeWidth={1.5} />
              )}
              <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-1 text-white shadow-lg">
                <UploadCloud size={10} strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[12px] font-bold text-slate-700 dark:text-neutral-200">
                Tap to upload {label.toLowerCase()}
              </p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                Max size: 5MB • PNG, JPG, PDF
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={type === "image" ? "image/*" : "application/pdf,image/*"}
        onChange={handleFileChange}
      />
    </div>
  );
}
