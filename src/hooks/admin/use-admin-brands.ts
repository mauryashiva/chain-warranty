"use client";

import { useState, useEffect } from "react";

export function useAdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/brands");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch brands");
      setBrands(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (brandData: { name: string; country: string }) => {
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create brand");
      fetchBrands(); // Refresh list
      return json.data;
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return { brands, loading, error, refresh: fetchBrands, createBrand };
}
