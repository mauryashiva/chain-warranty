"use client";

import { useRef, useState, ChangeEvent, DragEvent } from "react";
import {
  Upload,
  Info,
  X,
  ChevronDown,
  Calendar,
  Package,
  Layers,
  Truck,
  Store,
  FileText,
} from "lucide-react";
import { useAdminBrands } from "@/hooks/admin/use-admin-brands";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

interface BulkUploadSerialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkUploadSerialsModal({
  isOpen,
  onClose,
}: BulkUploadSerialsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { brands } = useAdminBrands();
  const { products } = useAdminProducts();

  useClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  // --- Handlers ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Updated text colors: slate-800 for light, slate-200 for dark
  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1";

  const inputClasses =
    "w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all focus:bg-white dark:focus:bg-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 appearance-none";

  const helperTextClasses =
    "text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-600 via-indigo-500 to-blue-600" />

        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-50 dark:border-gray-800/60 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Bulk Upload Serial Numbers
            </h2>
            <p className={cn(helperTextClasses, "mt-1 opacity-70")}>
              Initialize new asset specifications in the global registry.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-slate-500 transition-all"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Brand Select */}
            <div className="space-y-1">
              <label className={labelClasses}>Brand *</label>
              <div className="relative group">
                <Layers
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                  strokeWidth={2}
                />
                <select
                  className={cn(inputClasses, "pl-12")}
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">Select brand</option>
                  {brands?.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            {/* Product Select */}
            <div className="space-y-1">
              <label className={labelClasses}>Product / SKU *</label>
              <div className="relative group">
                <Package
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                  strokeWidth={2}
                />
                <select className={cn(inputClasses, "pl-12")}>
                  <option value="">Select product</option>
                  {products
                    ?.filter(
                      (p: any) => !selectedBrand || p.brandId === selectedBrand,
                    )
                    .map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Batch / Lot Number</label>
              <input
                placeholder="e.g. LOT-2024-Q2-IN"
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Manufacturing Date</label>
              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                />
                <input
                  type="date"
                  className={cn(inputClasses, "pl-12 dark:color-scheme-dark")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Dispatch Date</label>
              <div className="relative group">
                <Truck
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                />
                <input
                  type="date"
                  className={cn(inputClasses, "pl-12 dark:color-scheme-dark")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Retailer Assigned</label>
              <div className="relative group">
                <Store
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                />
                <select className={cn(inputClasses, "pl-12")}>
                  <option value="">All retailers</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Drag & Drop Logic */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "group border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
              isDragging
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-200 dark:border-gray-800 bg-slate-50/30 dark:bg-gray-800/20 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
            )}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
                <div className="p-5 bg-emerald-500/10 text-emerald-600 rounded-2xl relative">
                  <FileText size={32} strokeWidth={2.5} />
                  <button
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-full text-rose-500 hover:scale-110 transition-transform shadow-sm"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {file.name}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                    File attached - {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-5 bg-blue-600/10 text-blue-600 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                  <Upload size={32} strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Drop CSV file here or click to upload
                  </p>
                  <p
                    className={cn(
                      helperTextClasses,
                      "mt-1 lowercase font-medium opacity-60",
                    )}
                  >
                    format:{" "}
                    <span className="font-black text-blue-600">
                      serial_number, product_sku, manufacture_date, batch_id
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-slate-50 dark:border-gray-800/60 flex items-center justify-between bg-slate-50/30 dark:bg-gray-950/20">
          <div className="flex items-center gap-3">
            <Info size={14} className="text-blue-600" strokeWidth={3} />
            <p className={helperTextClasses}>
              CSV must have columns: serial_number, sku, manufacture_date,
              batch_id.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!file}
              className={cn(
                "px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all",
                file
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95"
                  : "bg-slate-200 dark:bg-gray-800 text-slate-400 cursor-not-allowed",
              )}
            >
              Upload & Validate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
