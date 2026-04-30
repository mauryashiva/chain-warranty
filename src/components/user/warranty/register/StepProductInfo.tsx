"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";

import ProductBasicDetails from "./ProductBasicDetails";
import ProductValidation from "./ProductValidation";
import PurchaseDetails from "./PurchaseDetails";

export default function StepProductInfo({
  data,
  update,
  onNext,
  onBack,
  step = 1,
}: any) {
  const [isCheckingSerial, setIsCheckingSerial] = useState(false);
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

        if (selectedProduct && selectedProduct.serialRegex) {
          try {
            const regex = new RegExp(selectedProduct.serialRegex);
            if (!regex.test(value.trim())) {
              return `Serial does not match product pattern: ${selectedProduct.serialRegex}`;
            }
          } catch (err) {
            console.error("Invalid regex pattern:", selectedProduct.serialRegex);
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
      case "price":
        if (!value || parseFloat(value) <= 0) return "Valid price is required";
        return "";
      case "currency":
        if (!value) return "Currency is required";
        return "";
      default:
        return "";
    }
  };

  // Check if current step is valid
  const isStepValid = (): boolean => {
    if (step === 1) {
      return !!(data.brandId && data.productId && data.category);
    } else if (step === 2) {
      if (!data.serialNumber?.trim()) return false;
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
      return !!(
        data.purchaseDate && 
        data.category && 
        data.country && 
        data.price && 
        data.currency
      );
    }
    return false;
  };

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
        category: selectedProduct.category || data.category,
        warrantyPeriod: selectedProduct.warrantyPeriod || data.warrantyPeriod,
      });
      setErrors((prev) => ({ ...prev, imei: "" }));
    }
  }, [selectedProduct?.id]);

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
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          {step === 1 && "Select Your Product"}
          {step === 2 && "Validate Serial Number"}
          {step === 3 && "Purchase Information"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {step === 1 && "Choose the brand and product for your warranty registration"}
          {step === 2 && "Enter and validate your product's serial number"}
          {step === 3 && "Provide purchase details and pricing information"}
        </p>
      </div>

      {step === 1 && (
        <ProductBasicDetails
          data={data}
          update={update}
          updateWithValidation={updateWithValidation}
          errors={errors}
          isCheckingSerial={isCheckingSerial}
          handleSerialChange={handleSerialChange}
          selectedProduct={selectedProduct}
          inputClasses={inputClasses}
          labelClasses={labelClasses}
          secondaryText={secondaryText}
        />
      )}

      {step === 2 && (
        <ProductValidation
          data={data}
          updateWithValidation={updateWithValidation}
          errors={errors}
          isCheckingSerial={isCheckingSerial}
          handleSerialChange={handleSerialChange}
          requiresImei={requiresImei}
          inputClasses={inputClasses}
          labelClasses={labelClasses}
          secondaryText={secondaryText}
        />
      )}

      {step === 3 && (
        <PurchaseDetails
          data={data}
          update={update}
          updateWithValidation={updateWithValidation}
          errors={errors}
          inputClasses={inputClasses}
          labelClasses={labelClasses}
        />
      )}

      <div className="flex flex-col items-center justify-between gap-4 pt-4">
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
                    <li key={field} className="text-xs text-red-600 dark:text-red-400">
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
              <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              BACK
            </button>
          )}

          <button
            onClick={() => {
              const stepErrors: Record<string, string> = {};
              if (step === 1) {
                if (!data.brandId) stepErrors.brandId = "Please select a brand";
                if (!data.productId) stepErrors.productId = "Please select a product";
                if (!data.category) stepErrors.category = "Product category is required";
              } else if (step === 2) {
                if (!data.serialNumber?.trim()) stepErrors.serialNumber = "Serial number is required";
                if (requiresImei && !data.imei?.trim()) stepErrors.imei = "IMEI is required";
                if (data.imei && !/^\d{15}$/.test(data.imei.trim())) stepErrors.imei = "IMEI must be 15 digits";
              } else if (step === 3) {
                if (!data.purchaseDate) stepErrors.purchaseDate = "Purchase date is required";
                if (!data.country) stepErrors.country = "Country is required";
                if (!data.price) stepErrors.price = "Price is required";
                if (!data.currency) stepErrors.currency = "Currency is required";
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
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}