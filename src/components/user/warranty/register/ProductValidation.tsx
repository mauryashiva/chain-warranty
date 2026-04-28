"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Hash, Loader2 } from "lucide-react";

export default function ProductValidation({
  data,
  updateWithValidation,
  errors,
  isCheckingSerial,
  handleSerialChange,
  requiresImei,
  inputClasses,
  labelClasses,
  secondaryText,
}: any) {
  return (
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
  );
}