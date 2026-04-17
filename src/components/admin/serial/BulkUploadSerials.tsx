"use client";

import { useRef, useState, ChangeEvent, DragEvent } from "react";
import {
  Upload,
  Info,
  X,
  Calendar,
  Truck,
  FileText,
  Loader2,
} from "lucide-react";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";
import { useAdminSerials } from "@/hooks/admin/use-admin-serials";
import { useAdminRetailers } from "@/hooks/admin/use-admin-retailers";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import Papa from "papaparse";
import BrandSelect from "@/components/common/Form/BrandSelect";
import ProductSelect from "@/components/common/Form/ProductSelect";
import RetailerSelect from "@/components/common/Form/RetailerSelect";

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
  const selectedProductData = products?.find(
    (product: any) => product.id === selectedProduct,
  );
  const requiresImei =
    selectedProductData?.identificationType === "SERIAL_IMEI";

  const { uploadSerials } = useAdminSerials();

  useClickOutside(modalRef, onClose);

  // --- CSV Parser ---
  const parseCSV = (
    file: File,
  ): Promise<Array<{ serialNumber: string; imei?: string }>> => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const serials = results.data
            .map((row: any) => {
              const serial = (
                row.serial_number ||
                row.serial ||
                row.serialNumber
              )?.trim();
              const rawImei = row.imei || row.IMEI;
              const imei = rawImei ? rawImei.toString().trim() : undefined;
              if (!serial) return null;
              return requiresImei
                ? { serialNumber: serial, imei }
                : { serialNumber: serial };
            })
            .filter(Boolean) as Array<{ serialNumber: string; imei?: string }>;
          resolve(serials);
        },
      });
    });
  };

  // --- Final Submit Handler ---
  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      let serialItems: Array<{ serialNumber: string; imei?: string }> = [];

      if (entryMode === "file" && file) {
        serialItems = await parseCSV(file);
      } else {
        serialItems = manualSerials
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => {
            if (requiresImei) {
              const [serial, imei] = line
                .split(/[|,]/)
                .map((value) => value.trim());
              return { serialNumber: serial, imei };
            }

            return { serialNumber: line };
          });
      }

      if (serialItems.length === 0) {
        alert("No valid serial numbers found.");
        return;
      }

      await uploadSerials({
        serials: serialItems,
        productId: selectedProduct,
        batchId: batchId,
        manufactureDate: mfgDate,
        dispatchDate: dispatchDate,
        retailerId: retailerId,
      });

      onClose();
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
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-600 via-indigo-500 to-blue-600 z-50" />

        {/* Header - Sticky */}
        <div className="px-10 py-8 border-b border-slate-50 dark:border-gray-800/60 flex items-center justify-between shrink-0 bg-white dark:bg-gray-900 z-40">
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
            className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-slate-500 transition-all active:scale-90"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
            <div className="space-y-1">
              <label className={labelClasses}>Brand *</label>
              <BrandSelect
                value={selectedBrand}
                onChange={(id) => {
                  setSelectedBrand(id);
                  setSelectedProduct("");
                }}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Product / SKU *</label>
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none"
                  size={16}
                />
                <input
                  type="date"
                  value={mfgDate}
                  onChange={(e) => setMfgDate(e.target.value)}
                  className={cn(
                    inputClasses,
                    "pl-12 scheme-light dark:scheme-dark",
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Dispatch Date</label>
              <div className="relative group">
                <Truck
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none"
                  size={16}
                />
                <input
                  type="date"
                  value={dispatchDate}
                  onChange={(e) => setDispatchDate(e.target.value)}
                  className={cn(
                    inputClasses,
                    "pl-12 scheme-light dark:scheme-dark",
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Retailer Assigned</label>
              <RetailerSelect
                value={retailerId}
                onChange={setRetailerId}
                placeholder="Select partner..."
              />
            </div>
          </div>

          {/* Entry Mode Selector */}
          <div className="space-y-6">
            <div className="flex gap-8 border-b border-slate-100 dark:border-gray-800 pb-0.5">
              {["file", "manual"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setEntryMode(mode as any)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] pb-4 px-2 transition-all relative",
                    entryMode === mode
                      ? "text-blue-600"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  {mode === "file" ? "CSV Bulk Upload" : "Manual Entry"}
                  {entryMode === mode && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full animate-in slide-in-from-bottom-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Upload Area */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              {entryMode === "file" ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={cn(
                    "group border-2 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                    isDragging
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10 scale-[0.99]"
                      : "border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/20 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-gray-800/40",
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
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-emerald-500" size={32} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        {(file.size / 1024).toFixed(2)} KB • Ready to parse
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-blue-600" size={32} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                        Drop CSV or Click to Upload
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    value={manualSerials}
                    onChange={(e) => setManualSerials(e.target.value)}
                    placeholder={
                      requiresImei
                        ? "SERIAL123|123456789012345\nSERIAL456|234567890123456"
                        : "SN-2024-001\nSN-2024-002"
                    }
                    className={cn(
                      inputClasses,
                      "min-h-48 py-6 px-6 resize-none font-mono text-xs leading-relaxed",
                    )}
                  />
                  <div className="absolute top-4 right-4 text-[9px] font-black text-slate-400 uppercase">
                    {requiresImei ? "Serial|IMEI per line" : "One per line"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="px-10 py-6 border-t border-slate-50 dark:border-gray-800/60 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-gray-950/20 z-40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Info size={14} className="text-blue-600" strokeWidth={3} />
            </div>
            <p className={helperTextClasses}>
              Registry requires unique serial numbers per SKU.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isUploading}
              className={cn(
                "px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                isFormValid && !isUploading
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95"
                  : "bg-slate-200 dark:bg-gray-800 text-slate-400 dark:text-slate-600 cursor-not-allowed",
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Processing...
                </>
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
