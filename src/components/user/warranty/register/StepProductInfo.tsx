"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  DollarSign,
  ArrowRight,
  Package,
  ShoppingCart,
  CheckCircle2,
  CalendarCheck,
  Search,
  Loader2,
  Hash,
  ChevronDown,
  Edit3,
} from "lucide-react";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";

// Integrated your custom selectors
import BrandSelect from "@/components/common/Form/BrandSelect";
import ProductSelect from "@/components/common/Form/ProductSelect";
// 🌍 Composable Location Selector
import LocationRoot, {
  CountryField,
} from "@/components/common/Form/LocationSelector";

const CONDITIONS = ["New", "Open box", "Refurbished", "Pre-owned"];
const CATEGORIES = [
  "Headphones / Audio",
  "Smartphone",
  "Laptop / Computer",
  "Smart TV",
  "Camera",
  "Tablet",
  "Wearable",
  "Other electronics",
];
const PERIODS = [
  "1 year",
  "2 years",
  "3 years",
  "5 years",
  "Lifetime",
  "Other",
];

export default function StepProductInfo({
  data,
  update,
  onNext,
  onBack,
  step = 1,
}: any) {
  const [isCheckingSerial, setIsCheckingSerial] = useState(false);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { products } = useAdminProducts();

  const selectedProduct = products?.find(
    (product: any) => product.id === data.productId,
  );
  const requiresImei = selectedProduct?.identificationType === "SERIAL_IMEI";

  // Validate field and set error
  const validateField = (fieldName: string, value: any): string => {
    switch (fieldName) {
      case "serialNumber":
        if (!value?.trim()) return "Serial number is required";
        if (value.trim().length < 3)
          return "Serial number must be at least 3 characters";

        // If product is selected, validate against product's serial regex pattern
        if (selectedProduct && selectedProduct.serialRegex) {
          try {
            const regex = new RegExp(selectedProduct.serialRegex);
            if (!regex.test(value.trim())) {
              return `Serial does not match product pattern: ${selectedProduct.serialRegex}`;
            }
          } catch (err) {
            console.error(
              "Invalid regex pattern:",
              selectedProduct.serialRegex,
            );
          }
        }
        return "";
      case "imei":
        if (requiresImei && !value?.trim())
          return "IMEI is required for this product";
        if (value && !/^\d{15}$/.test(value.trim()))
          return "IMEI must be exactly 15 digits";
        return "";
      case "productId":
        if (!value) return "Please select a product";
        return "";
      case "brandId":
        if (!value) return "Please select a brand";
        return "";
      case "category":
        if (!value) return "Product category is required";
        return "";
      case "purchaseDate":
        if (!value) return "Purchase date is required";
        const purchaseDate = new Date(value);
        if (purchaseDate > new Date())
          return "Purchase date cannot be in the future";
        return "";
      case "country":
        if (!value) return "Country is required";
        return "";
      default:
        return "";
    }
  };

  // Check if current step is valid (without setting errors)
  const isStepValid = (): boolean => {
    if (step === 1) {
      return !!(data.brandId && data.productId && data.category);
    } else if (step === 2) {
      if (!data.serialNumber?.trim()) return false;

      // Check serial regex if product is selected
      if (selectedProduct && selectedProduct.serialRegex) {
        try {
          const regex = new RegExp(selectedProduct.serialRegex);
          if (!regex.test(data.serialNumber.trim())) return false;
        } catch (err) {
          return false;
        }
      }

      if (requiresImei && !data.imei?.trim()) return false;
      if (data.imei && !/^\d{15}$/.test(data.imei.trim())) return false;
      return true;
    } else if (step === 3) {
      return !!(data.purchaseDate && data.category && data.country);
    }
    return false;
  };

  // Update field with validation
  const updateWithValidation = (updates: any) => {
    const newErrors = { ...errors };

    Object.entries(updates).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
      } else {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);
    update(updates);
  };

  useEffect(() => {
    if (selectedProduct) {
      update({
        modelNumber: selectedProduct.modelNumber || "",
        productName: selectedProduct.name || "",
        brand: selectedProduct.brand?.name || data.brand,
        brandId: selectedProduct.brandId,
      });
      // Clear IMEI error when product changes
      setErrors((prev) => ({ ...prev, imei: "" }));
    }
  }, [selectedProduct?.id]);

  // 🔥 Bridge LocationSelector state with the 'update' prop
  const locationValues = {
    country: data.country || "",
  };

  const handleLocationChange = (field: string, value: string) => {
    update({ [field]: value });
  };

  // 🔥 LOGIC: Auto-Calculate Expiry Date
  useEffect(() => {
    if (data.purchaseDate && data.warrantyPeriod) {
      const purchase = new Date(data.purchaseDate);
      const yearsMatch = data.warrantyPeriod.match(/\d+/);
      const yearsToAdd = yearsMatch ? parseInt(yearsMatch[0]) : 1;
      const expiry = new Date(purchase);
      expiry.setFullYear(expiry.getFullYear() + yearsToAdd);
      const formattedExpiry = expiry.toISOString().split("T")[0];

      if (data.expiryDate !== formattedExpiry) {
        update({ expiryDate: formattedExpiry });
      }
    }
  }, [data.purchaseDate, data.warrantyPeriod]);

  // 🔥 LOGIC: Auto-Fetch Product by Serial
  const handleSerialChange = async (serial: string) => {
    updateWithValidation({ serialNumber: serial });

    if (serial.length >= 6) {
      setIsCheckingSerial(true);
      try {
        const res = await fetch(`/api/user/verify?serial=${serial}`);
        const result = await res.json();

        if (result.success && result.data) {
          update({
            brandId: result.data.brandId,
            productId: result.data.id,
            productName: result.data.name,
            brand: result.data.brand?.name,
          });
        }
      } catch (err) {
        console.log("No matching product found in registry.");
      } finally {
        setIsCheckingSerial(false);
      }
    }
  };

  const inputClasses =
    "w-full px-5 py-4 rounded-xl border border-gray-200 bg-white text-sm font-medium outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:border-blue-500 h-[52px] flex items-center";
  const labelClasses =
    "text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2.5 block ml-1";
  const secondaryText =
    "text-[10px] font-bold uppercase tracking-tight text-slate-800 dark:text-slate-200 opacity-60 mt-1.5 ml-1";

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          {step === 1 && "Select Your Product"}
          {step === 2 && "Validate Serial Number"}
          {step === 3 && "Purchase Information"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {step === 1 &&
            "Choose the brand and product for your warranty registration"}
          {step === 2 && "Enter and validate your product's serial number"}
          {step === 3 && "Provide purchase details and pricing information"}
        </p>
      </div>

      {/* SECTION 1: BASIC PRODUCT DETAILS - Step 1 */}
      {step === 1 && (
        <section className="p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600">
              <Package size={16} strokeWidth={3} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 whitespace-nowrap">
              01. Basic Product Details
            </h3>
            <div className="h-px w-full bg-linear-to-r from-blue-100 to-transparent dark:from-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className={labelClasses}>Serial number *</label>
              <div className="relative">
                <input
                  value={data.serialNumber}
                  onChange={(e) => handleSerialChange(e.target.value)}
                  placeholder="Enter Serial to auto-fetch details..."
                  className={cn(
                    inputClasses,
                    "pr-12 border-blue-100 dark:border-blue-900/30",
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isCheckingSerial ? (
                    <Loader2 className="animate-spin text-blue-600" size={18} />
                  ) : data.productId ? (
                    <CheckCircle2 className="text-emerald-500" size={18} />
                  ) : (
                    <Search className="text-gray-300" size={18} />
                  )}
                </div>
              </div>
              <p className={secondaryText}>
                Primary identifier for on-chain registry
              </p>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Select Brand *</label>
              <BrandSelect
                value={data.brandId}
                onChange={(val: string) =>
                  updateWithValidation({ brandId: val })
                }
              />
              {errors.brandId && (
                <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
                  ❌ {errors.brandId}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Product / Model *</label>
              <ProductSelect
                value={data.productId}
                brandId={data.brandId}
                disabled={!data.brandId}
                onChange={(val: string) =>
                  updateWithValidation({ productId: val })
                }
              />
              {errors.productId && (
                <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
                  ❌ {errors.productId}
                </p>
              )}
              {selectedProduct && (
                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-700 dark:text-slate-300 opacity-80 mt-2">
                  {selectedProduct.identificationType === "SERIAL_IMEI"
                    ? "✓ Requires serial + IMEI for registration."
                    : "✓ Requires serial only for registration."}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Model number</label>
              <input
                value={data.modelNumber}
                readOnly
                placeholder="Select a product to auto-fill model number"
                className={cn(
                  inputClasses,
                  "bg-slate-100 dark:bg-gray-900 cursor-not-allowed",
                )}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Color / Variant</label>
              <input
                value={data.color}
                onChange={(e) => update({ color: e.target.value })}
                placeholder="e.g. Midnight Black"
                className={inputClasses}
              />
            </div>

            {/* 🔥 DROPDOWN CATEGORY SECTION */}
            <div className="space-y-1 md:col-span-1">
              <label className={labelClasses}>Product Category *</label>
              <div className="relative">
                <select
                  value={
                    CATEGORIES.includes(data.category)
                      ? data.category
                      : data.category
                        ? "Other electronics"
                        : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "Other electronics") {
                      setShowOtherCategory(true);
                      updateWithValidation({ category: "" }); // Reset to allow typing
                    } else {
                      setShowOtherCategory(false);
                      updateWithValidation({ category: val });
                    }
                  }}
                  className={cn(
                    inputClasses,
                    "appearance-none cursor-pointer pr-10",
                    errors.category
                      ? "border-red-500 focus:border-red-500 focus:ring-red-600/5"
                      : "",
                  )}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
              {errors.category && (
                <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
                  ❌ {errors.category}
                </p>
              )}
            </div>

            {/* 🔥 "OTHER" INPUT FIELD (Conditional) */}
            {(showOtherCategory ||
              (data.category && !CATEGORIES.includes(data.category))) && (
              <div className="space-y-1 md:col-span-1 animate-in slide-in-from-left-2 duration-300">
                <label className={labelClasses}>Specify Category *</label>
                <div className="relative">
                  <Edit3
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                    size={16}
                  />
                  <input
                    autoFocus
                    value={data.category}
                    onChange={(e) => update({ category: e.target.value })}
                    placeholder="Type category name..."
                    className={cn(
                      inputClasses,
                      "pl-12 border-blue-200 dark:border-blue-900/50",
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: SERIAL VALIDATION - Step 2 */}
      {step === 2 && (
        <section className="p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/20">
              <Hash size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Serial Number Validation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your product's serial number for verification
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className={labelClasses}>Serial Number *</label>
              <div className="relative">
                <Hash
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  value={data.serialNumber}
                  onChange={(e) => handleSerialChange(e.target.value)}
                  placeholder="Enter serial number..."
                  className={cn(
                    inputClasses,
                    "pl-12",
                    errors.serialNumber
                      ? "border-red-500 focus:border-red-500 focus:ring-red-600/5"
                      : "",
                  )}
                />
                {isCheckingSerial && (
                  <Loader2
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin"
                    size={16}
                  />
                )}
              </div>
              {errors.serialNumber && (
                <p className="text-xs font-semibold text-red-500 ml-1">
                  ❌ {errors.serialNumber}
                </p>
              )}
              <p className={secondaryText}>
                Usually found on the product packaging or device
              </p>
            </div>

            {/* IMEI Field - Always shown but validation changes based on product */}
            <div className="space-y-2">
              <label
                className={cn(labelClasses, requiresImei ? "text-red-600" : "")}
              >
                {requiresImei ? "IMEI * (Required)" : "IMEI (Optional)"}
              </label>
              <input
                value={data.imei || ""}
                onChange={(e) => updateWithValidation({ imei: e.target.value })}
                placeholder={
                  requiresImei ? "Enter 15-digit IMEI..." : "Optional IMEI"
                }
                className={cn(
                  inputClasses,
                  errors.imei
                    ? "border-red-500 focus:border-red-500 focus:ring-red-600/5"
                    : "",
                )}
              />
              {errors.imei && (
                <p className="text-xs font-semibold text-red-500 ml-1">
                  ❌ {errors.imei}
                </p>
              )}
              <p className={secondaryText}>
                {requiresImei
                  ? "This product requires both serial and IMEI for warranty registration."
                  : "IMEI is optional unless the selected product requires it."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: PURCHASE DETAILS - Step 3 */}
      {step === 3 && (
        <section className="p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600">
              <ShoppingCart size={16} strokeWidth={3} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 whitespace-nowrap">
              02. Purchase Details
            </h3>
            <div className="h-px w-full bg-linear-to-r from-blue-100 to-transparent dark:from-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Purchase date *</label>
              <div className="relative">
                <input
                  type="date"
                  value={data.purchaseDate}
                  onChange={(e) =>
                    updateWithValidation({ purchaseDate: e.target.value })
                  }
                  className={cn(
                    inputClasses,
                    "pr-12",
                    errors.purchaseDate
                      ? "border-red-500 focus:border-red-500 focus:ring-red-600/5"
                      : "",
                  )}
                />
                <Calendar
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {errors.purchaseDate && (
                <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
                  ❌ {errors.purchaseDate}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Warranty period</label>
              <div className="relative">
                <select
                  value={data.warrantyPeriod}
                  onChange={(e) => update({ warrantyPeriod: e.target.value })}
                  className={cn(
                    inputClasses,
                    "appearance-none cursor-pointer pr-10",
                  )}
                >
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Expiry (Calculated)</label>
              <div className="relative">
                <input
                  readOnly
                  value={data.expiryDate || "Calculating..."}
                  className={cn(
                    inputClasses,
                    "pr-12 bg-gray-50/50 dark:bg-gray-800/50 cursor-not-allowed opacity-80",
                  )}
                />
                <CalendarCheck
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 opacity-60"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Price (USD)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={data.price}
                  onChange={(e) => update({ price: e.target.value })}
                  placeholder="0.00"
                  className={cn(inputClasses, "pl-12")}
                />
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Retailer</label>
              <input
                value={data.retailer}
                onChange={(e) => update({ retailer: e.target.value })}
                placeholder="e.g. Amazon"
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Invoice Number</label>
              <div className="relative">
                <input
                  value={data.invoiceNumber}
                  onChange={(e) => update({ invoiceNumber: e.target.value })}
                  placeholder="INV-2024-001"
                  className={cn(inputClasses, "pl-12")}
                />
                <Hash
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <LocationRoot
              values={locationValues}
              onChange={(field: string, value: string) => {
                handleLocationChange(field, value);
                updateWithValidation({ [field]: value });
              }}
            >
              <div className="space-y-1 lg:col-span-1">
                <CountryField label="Country *" />
                {errors.country && (
                  <p className="text-xs font-semibold text-red-500 mt-1 ml-1">
                    ❌ {errors.country}
                  </p>
                )}
              </div>
            </LocationRoot>
          </div>
        </section>
      )}

      {/* SECTION 3: CONDITION - Step 3 */}
      {step === 3 && (
        <section className="space-y-5 p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <label className={labelClasses}>
            Product condition at registration
          </label>
          <div className="flex flex-wrap gap-3">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => update({ condition: c })}
                className={cn(
                  "group relative px-8 py-4 rounded-2xl text-[13px] font-black tracking-tight transition-all border active:scale-95 flex items-center gap-3 overflow-hidden",
                  data.condition === c
                    ? "bg-gray-900 text-white border-gray-900 shadow-xl dark:bg-blue-600 dark:border-blue-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400",
                )}
              >
                {data.condition === c && (
                  <CheckCircle2
                    size={16}
                    className="text-blue-400 dark:text-white animate-in zoom-in-50"
                  />
                )}
                {c}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <div className="flex flex-col items-center justify-between gap-4 pt-4">
        {/* Error Summary - Only show if there are actual errors AND form is not valid */}
        {!isStepValid() &&
          Object.keys(errors).length > 0 &&
          Object.values(errors).some((e) => e) && (
            <div className="w-full p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg animate-in slide-in-from-top-2 duration-300">
              <p className="text-xs font-black text-red-700 dark:text-red-400 uppercase mb-2">
                ⚠️ Please fix the following errors:
              </p>
              <ul className="space-y-1">
                {Object.entries(errors)
                  .filter(([_, error]) => error && error.trim() !== "")
                  .map(([field, error]) => (
                    <li
                      key={field}
                      className="text-xs text-red-600 dark:text-red-400"
                    >
                      • {error}
                    </li>
                  ))}
              </ul>
            </div>
          )}

        <div className="flex items-center justify-between w-full">
          {step > 1 && (
            <button
              onClick={onBack}
              className="group flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
            >
              <ArrowRight
                size={16}
                className="rotate-180 group-hover:-translate-x-1 transition-transform"
              />
              BACK
            </button>
          )}

          <button
            onClick={() => {
              // Validate all required fields before proceeding
              const stepErrors: Record<string, string> = {};

              if (step === 1) {
                if (!data.brandId) stepErrors.brandId = "Please select a brand";
                if (!data.productId)
                  stepErrors.productId = "Please select a product";
                if (!data.category)
                  stepErrors.category = "Product category is required";
              } else if (step === 2) {
                if (!data.serialNumber?.trim())
                  stepErrors.serialNumber = "Serial number is required";
                if (requiresImei && !data.imei?.trim())
                  stepErrors.imei = "IMEI is required for this product";
                if (data.imei && !/^\d{15}$/.test(data.imei.trim()))
                  stepErrors.imei = "IMEI must be exactly 15 digits";
              } else if (step === 3) {
                if (!data.purchaseDate)
                  stepErrors.purchaseDate = "Purchase date is required";
                if (!data.category)
                  stepErrors.category = "Product category is required";
                if (!data.country) stepErrors.country = "Country is required";
              }

              if (Object.keys(stepErrors).length > 0) {
                setErrors(stepErrors);
              } else {
                setErrors({});
                onNext();
              }
            }}
            disabled={!isStepValid()}
            className="group flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ml-auto"
          >
            {step === 3 ? "CONTINUE TO UPLOAD" : "NEXT"}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
