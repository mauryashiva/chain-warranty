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
        setPreview("pdf-detected");
      }
    }
  };

  const clearFile = () => {
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="group space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-700 dark:text-gray-400">
          {label}
        </label>

        {preview && (
          <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter animate-in fade-in slide-in-from-right-2">
            <CheckCircle2 size={12} strokeWidth={3} />
            READY
          </span>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative h-48 w-full cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden",
          preview
            ? "border-blue-500 bg-blue-50/30 dark:bg-blue-500/5 shadow-2xl shadow-blue-500/10"
            : "border-gray-300 bg-gray-100/60 hover:border-blue-400 hover:bg-blue-50/60 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-blue-900",
        )}
      >
        {preview ? (
          <div className="relative h-full w-full group/preview">
            {preview === "pdf-detected" ? (
              <div className="flex h-full w-full animate-in fade-in zoom-in-95 duration-500 flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
                <div className="p-5 rounded-[20px] bg-gray-100 dark:bg-gray-800 shadow-inner">
                  <FileText size={36} className="text-blue-600" />
                </div>

                <div className="text-center space-y-1">
                  <p className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-widest">
                    Document Attached
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                    Validated for Chain
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full animate-in fade-in duration-700">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover/preview:scale-110"
                />
                <div className="absolute inset-0 bg-gray-950/20 transition-opacity group-hover/preview:opacity-0" />
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="absolute right-4 top-4 z-20 rounded-2xl bg-white p-2 text-gray-900 shadow-2xl transition-all hover:bg-rose-500 hover:text-white dark:bg-gray-800 dark:text-white"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 px-6 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-gray-500 shadow-xl shadow-gray-200/20 ring-1 ring-gray-200 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-600 group-hover:ring-blue-100 dark:bg-gray-900 dark:ring-gray-800 dark:shadow-none dark:group-hover:ring-blue-900/50">
              {icon === "camera" ? (
                <Camera size={26} strokeWidth={1.5} />
              ) : (
                <FileText size={26} strokeWidth={1.5} />
              )}
              <div className="absolute -bottom-1.5 -right-1.5 rounded-full bg-blue-600 p-1.5 text-white shadow-xl ring-4 ring-white dark:ring-gray-900">
                <UploadCloud size={12} strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest">
                Tap to upload {label.toLowerCase()}
              </p>
              <p className="text-[9px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight opacity-80">
                Max size: 3MB • PNG, JPG, PDF
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
