"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";

// ✅ Comprehensive interface matching your Controller and Schema
export interface Retailer {
  id: string;
  name: string;
  slug: string;
  type: "ONLINE" | "OFFLINE" | "BOTH";
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  gstNumber?: string;
  panNumber?: string;
  taxId?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  brandIds?: string[]; // Used for updates
  brands?: { id: string; name: string }[]; // Used for display
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
   */
  const addRetailer = async (formData: any) => {
    try {
      setError(null);
      const result = await adminApiFetch("/retailers", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      await fetchRetailers(); // Sync UI immediately
      return result;
    } catch (err: any) {
      const msg = err.message || "Failed to onboard new retailer.";
      setError(msg);
      throw new Error(msg);
    }
  };

  /**
   * 🔄 Update Retailer Profile (ADDED THIS SECTION)
   * Sends a PATCH request to synchronize changes from the Edit Modal
   */
  const updateRetailer = async (id: string, formData: any) => {
    try {
      setError(null);
      const result = await adminApiFetch(`/retailers?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      await fetchRetailers(); // Refresh local catalog
      return result;
    } catch (err: any) {
      const msg = err.message || "Failed to update retailer profile.";
      setError(msg);
      throw new Error(msg);
    }
  };

  /**
   * 🗑️ Delete Retailer
   */
  const deleteRetailer = async (id: string) => {
    try {
      setError(null);
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
    updateRetailer, // ✅ Exported for EditRetailerModal
    deleteRetailer,
    refresh: fetchRetailers,
  };
}
