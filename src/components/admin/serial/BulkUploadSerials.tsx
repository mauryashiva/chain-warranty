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
  Loader2,
} from "lucide-react";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";
import { useAdminSerials } from "@/hooks/admin/use-admin-serials";
import { useAdminRetailers } from "@/hooks/admin/use-admin-retailers";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import Papa from "papaparse";
// 🏷️ Import premium Select components
import BrandSelect from "@/components/common/Form/BrandSelect";
import ProductSelect from "@/components/common/Form/ProductSelect";

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
  const [selectedProduct, setSelectedProduct] = useState("");
  const [batchId, setBatchId] = useState("");
  const [mfgDate, setMfgDate] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [retailerId, setRetailerId] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [manualSerials, setManualSerials] = useState("");
  const [entryMode, setEntryMode] = useState<"file" | "manual">("file");
  const [isUploading, setIsUploading] = useState(false);

  const { products } = useAdminProducts();
  const { uploadSerials } = useAdminSerials();
  const { retailers } = useAdminRetailers();

  useClickOutside(modalRef, onClose);

  // --- CSV Parser ---
  const parseCSV = (file: File): Promise<string[]> => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const serials = results.data
            .map((row: any) => row.serial_number)
            .filter(Boolean);
          resolve(serials);
        },
      });
    });
  };

  // --- Final Submit Handler ---
  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      let serialList: string[] = [];

      if (entryMode === "file" && file) {
        serialList = await parseCSV(file);
      } else {
        serialList = manualSerials
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }

      if (serialList.length === 0) {
        alert("No valid serial numbers found.");
        return;
      }

      await uploadSerials({
        serials: serialList,
        productId: selectedProduct,
        batchId: batchId,
        manufactureDate: mfgDate,
        dispatchDate: dispatchDate,
        retailerId: retailerId,
      });

      onClose();
      // Reset form
      setFile(null);
      setManualSerials("");
      setSelectedBrand("");
      setSelectedProduct("");
      setBatchId("");
      setMfgDate("");
      setDispatchDate("");
      setRetailerId("");
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      setEntryMode("file");
    }
  };

  if (!isOpen) return null;

  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 block ml-1";
  const inputClasses =
    "w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all focus:bg-white dark:focus:bg-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 appearance-none";
  const helperTextClasses =
    "text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200";

  const isFormValid =
    selectedProduct !== "" &&
    (file !== null || manualSerials.trim().length > 0);

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
            <div className="space-y-1">
              <label className={labelClasses}>Brand *</label>
              {/* 🏷️ Using premium searchable BrandSelect */}
              <BrandSelect
                value={selectedBrand}
                onChange={(id) => {
                  setSelectedBrand(id);
                  setSelectedProduct(""); // Reset product when brand changes
                }}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Product / SKU *</label>
              {/* 🏷️ Using premium searchable ProductSelect */}
              <ProductSelect
                value={selectedProduct}
                onChange={setSelectedProduct}
                brandId={selectedBrand}
                disabled={!selectedBrand}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Batch / Lot Number</label>
              <input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
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
                  value={mfgDate}
                  onChange={(e) => setMfgDate(e.target.value)}
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
                  value={dispatchDate}
                  onChange={(e) => setDispatchDate(e.target.value)}
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
                <select
                  className={cn(inputClasses, "pl-12 cursor-pointer")}
                  value={retailerId}
                  onChange={(e) => setRetailerId(e.target.value)}
                >
                  <option value="">All retailers</option>
                  {retailers?.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-b border-slate-50 dark:border-gray-800 pb-2">
            {["file", "manual"].map((mode) => (
              <button
                key={mode}
                onClick={() => setEntryMode(mode as any)}
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest pb-2 px-2 transition-all",
                  entryMode === mode
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-400",
                )}
              >
                {mode === "file" ? "CSV Upload" : "Manual Entry"}
              </button>
            ))}
          </div>

          {entryMode === "file" ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "group border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                isDragging
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-200 dark:border-gray-800 bg-slate-50/30 dark:bg-gray-800/20 hover:border-blue-500",
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
                <div className="text-center">
                  <FileText
                    className="mx-auto text-emerald-500 mb-2"
                    size={32}
                  />
                  <p className="text-sm font-black uppercase">{file.name}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto text-blue-600 mb-2" size={32} />
                  <p className="text-sm font-black uppercase">
                    Drop CSV or Click to Upload
                  </p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={manualSerials}
              onChange={(e) => setManualSerials(e.target.value)}
              placeholder="SN-2024-001&#10;SN-2024-002"
              className={cn(
                inputClasses,
                "min-h-40 py-4 resize-none font-mono text-xs",
              )}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-slate-50 dark:border-gray-800/60 flex items-center justify-between bg-slate-50/30 dark:bg-gray-950/20">
          <div className="flex items-center gap-3">
            <Info size={14} className="text-blue-600" strokeWidth={3} />
            <p className={helperTextClasses}>
              Registry requires unique serial numbers per SKU.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isUploading}
              className={cn(
                "px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                isFormValid && !isUploading
                  ? "bg-blue-600 text-white shadow-xl active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed",
              )}
            >
              {isUploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Upload & Validate"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
