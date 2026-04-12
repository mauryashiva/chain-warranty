"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";

// ✅ Updated to match Prisma Enum casing
export interface Brand {
  id: string;
  name: string;
  slug: string;
  country: string;
  status: "ACTIVE" | "INACTIVE" | "Active" | "Inactive";
  createdAt: string;
  website?: string;
  supportEmail?: string;
  supportPhone?: string;
  taxId?: string;
  logoUrl?: string;
  description?: string;
  _count?: {
    products: number;
  };
}

export interface CreateBrandInput {
  name: string;
  slug: string;
  country: string;
  status?: string;
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
  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminApiFetch<Brand[]>("/brands");
      setBrands(data || []);
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
      await fetchBrands();
      return newBrand;
    } catch (err: any) {
      const msg = err.message || "Could not initialize new brand.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // ✅ --- 3. Update Brand (THE MISSING FUNCTION) ---
  const updateBrand = async (
    id: string,
    brandData: Partial<CreateBrandInput>,
  ) => {
    try {
      setError(null);
      const updatedBrand = await adminApiFetch<Brand>(`/brands?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify(brandData),
      });

      // Refresh the list to reflect changes in the table immediately
      await fetchBrands();
      return updatedBrand;
    } catch (err: any) {
      const msg = err.message || "Failed to update brand registry.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // --- 4. Delete/Disable Brand ---
  const deleteBrand = async (id: string) => {
    try {
      setError(null);
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
    updateBrand, // ✅ Exported for use in components
    deleteBrand,
  };
}
