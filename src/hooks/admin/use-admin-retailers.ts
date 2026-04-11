"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";

// ✅ Updated interface to include PAN Number and other tax identifiers
export interface Retailer {
  id: string;
  name: string;
  slug: string;
  type: "ONLINE" | "OFFLINE" | "BOTH";
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  address?: string; // Added to match your controller
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  gstNumber?: string;
  panNumber?: string; // ✅ Added PAN Number
  taxId?: string; // ✅ Added Tax ID
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  brands?: { id: string; name: string }[];
  _count?: {
    serials: number;
    warranties: number;
  };
  createdAt: string;
}

export function useAdminRetailers() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 📜 Fetch all authorized retailers
   */
  const fetchRetailers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiFetch<Retailer[]>("/retailers");
      setRetailers(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch retailer registry.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🏗️ Add a new Retailer
   * (The formData object here will automatically contain panNumber from your form)
   */
  const addRetailer = async (formData: any) => {
    try {
      setError(null);
      const result = await adminApiFetch("/retailers", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      await fetchRetailers(); // Sync UI
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteRetailer = async (id: string) => {
    try {
      await adminApiFetch(`/retailers?id=${id}`, {
        method: "DELETE",
      });
      await fetchRetailers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchRetailers();
  }, [fetchRetailers]);

  return {
    retailers,
    loading,
    error,
    addRetailer,
    deleteRetailer,
    refresh: fetchRetailers,
  };
}
