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
  currency?: string; // 🆕 Added to match your new UI and Database

  // Metadata
  launchDate?: string;
  manufactureCountry?: string;
  hsnCode?: string;
  variants?: string;
  serialRegex?: string;
  description?: string;
  termsUrl?: string;
  status: string;
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
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to sync product catalog.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. Add New Product (Supports all extended fields) ---
  const addProduct = async (productData: any) => {
    try {
      setError(null);
      const result = await adminApiFetch<Product>("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });

      // Refresh the local state to show the new product immediately
      await fetchProducts();
      return result;
    } catch (err: any) {
      const msg = err.message || "Protocol Error: Could not register asset.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // --- 3. Remove Product ---
  const deleteProduct = async (id: string) => {
    try {
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
    fetchProducts, // Manual Refresh
    addProduct, // Create Function
    deleteProduct, // Delete Function
  };
}
