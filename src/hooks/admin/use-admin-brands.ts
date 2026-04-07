"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";

// Defined based on your Prisma Schema
export interface Brand {
  id: string;
  name: string;
  slug: string;
  country: string;
  status: "Active" | "Inactive";
  createdAt: string;
  _count?: {
    products: number;
  };
}

export interface CreateBrandInput {
  name: string;
  slug: string;
  country: string;
  website?: string;
  supportEmail?: string;
  supportPhone?: string;
  taxId?: string;
  logoUrl?: string;
  description?: string;
}

export function useAdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Fetch Brands ---
  // Wrapped in useCallback to prevent unnecessary re-renders when passed to components
  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Using your custom adminApiFetch wrapper
      const data = await adminApiFetch<Brand[]>("/brands");
      setBrands(data);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve brand catalog.");
      console.error("Hook Error [fetchBrands]:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 2. Create Brand ---
  const createBrand = async (brandData: CreateBrandInput) => {
    try {
      setError(null);
      const newBrand = await adminApiFetch<Brand>("/brands", {
        method: "POST",
        body: JSON.stringify(brandData),
      });

      // Optimistic update or refresh
      await fetchBrands();
      return newBrand;
    } catch (err: any) {
      const msg = err.message || "Could not initialize new brand.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // --- 3. Delete/Disable Brand ---
  const deleteBrand = async (id: string) => {
    try {
      await adminApiFetch(`/brands?id=${id}`, {
        method: "DELETE",
      });
      await fetchBrands();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    isLoading,
    error,
    refresh: fetchBrands,
    createBrand,
    deleteBrand,
  };
}
