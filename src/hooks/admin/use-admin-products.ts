"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";

// Matches your Prisma Product model + Brand relation
export interface Product {
  id: string;
  name: string;
  modelNumber: string;
  sku: string;
  category: string;
  subCategory?: string;
  brandId: string;
  brand?: {
    name: string;
    slug: string;
  };
  warrantyPeriod: string;

  // Pricing & Value
  priceMin?: number;
  priceMax?: number;
  currency?: string;

  // Metadata
  launchDate?: string;
  manufactureCountry?: string;
  hsnCode?: string;
  variants?: string;
  serialRegex?: string;
  description?: string;
  termsUrl?: string;
  identificationType?: "SERIAL" | "SERIAL_IMEI";
  status: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
  _count?: {
    serials: number;
  };
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Fetch All Products ---
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiFetch<Product[]>("/products");
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to sync product catalog.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. Add New Product ---
  const addProduct = async (productData: any) => {
    try {
      setError(null);
      const result = await adminApiFetch<Product>("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });

      await fetchProducts();
      return result;
    } catch (err: any) {
      const msg = err.message || "Protocol Error: Could not register asset.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // ✅ --- 3. Update Product (ADDED THIS SECTION) ---
  const updateProduct = async (id: string, productData: any) => {
    try {
      setError(null);
      const result = await adminApiFetch<Product>(`/products?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify(productData),
      });

      // Refresh catalog to show changes immediately
      await fetchProducts();
      return result;
    } catch (err: any) {
      const msg = err.message || "Failed to update asset specification.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // --- 4. Remove Product ---
  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await adminApiFetch(`/products?id=${id}`, {
        method: "DELETE",
      });
      await fetchProducts();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Initial Sync
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct, // ✅ Now exported for the Edit modal
    deleteProduct,
  };
}
