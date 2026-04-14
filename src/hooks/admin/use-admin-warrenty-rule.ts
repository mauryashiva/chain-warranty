"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints"; // ✅ Integrated registry

// ✅ Type Definitions for the Policy Engine
export interface GlobalConfig {
  id: string;
  allowRegistrationAfterPurchase: boolean;
  maxDaysToRegister: number;
  allowTransfer: boolean;
  allowTransferWithOpenClaim: boolean;
  requireOtpForTransfer: boolean;
  requireIdProofForTransfer: boolean;
  allowClaimAfterExpiry: boolean;
  autoExpireNft: boolean;
  updatedAt: string;
}

export interface WarrantyRule {
  id: string;
  productId: string;
  defaultPeriod: number;
  extendedPeriod: number;
  maxClaimsAllowed: number;
  claimCooldownDays: number;
  isTransferable: boolean;
  updatedAt: string;
}

export interface ProductWithRule {
  id: string;
  name: string;
  sku: string;
  warrantyRule?: WarrantyRule;
}

export function useAdminWarrantyRules() {
  const [products, setProducts] = useState<ProductWithRule[]>([]);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 📜 Fetch Global Protocols and SKU Overrides
   * Pulls the combined policy data from the registry endpoint
   */
  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Now using endpoints.admin.warrantyRules
      const data = await adminApiFetch<{
        globalConfig: GlobalConfig;
        products: ProductWithRule[];
      }>(endpoints.admin.warrantyRules);

      setGlobalConfig(data.globalConfig);
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || "Failed to sync policy engine protocols.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🌏 Update Global System Protocols
   * Synchronizes baseline logic for the entire platform
   */
  const updateGlobalConfig = async (formData: Partial<GlobalConfig>) => {
    try {
      setError(null);
      const result = await adminApiFetch(endpoints.admin.warrantyRules, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      await fetchRules(); // Refresh data to ensure UI is in sync
      return result;
    } catch (err: any) {
      const msg = err.message || "Failed to update global protocols.";
      setError(msg);
      throw new Error(msg);
    }
  };

  /**
   * 🏗️ Update or Create SKU Override
   * Targets a specific product ID via query parameters
   */
  const saveProductRule = async (
    productId: string,
    formData: Partial<WarrantyRule>,
  ) => {
    try {
      setError(null);
      // ✅ Using query param pattern with centralized endpoint
      const result = await adminApiFetch(
        `${endpoints.admin.warrantyRules}?productId=${productId}`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
        },
      );

      await fetchRules(); // Sync local catalog with new overrides
      return result;
    } catch (err: any) {
      const msg = err.message || "Failed to commit SKU policy override.";
      setError(msg);
      throw new Error(msg);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    products,
    globalConfig,
    loading,
    error,
    updateGlobalConfig,
    saveProductRule,
    refresh: fetchRules,
  };
}
