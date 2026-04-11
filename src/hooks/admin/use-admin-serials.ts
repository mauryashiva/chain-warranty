"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";

// ✅ Updated to match all 4 Prisma Enums exactly
export interface Serial {
  id: string;
  serialNumber: string;
  batchId?: string;
  status: "UNREGISTERED" | "REGISTERED" | "FLAGGED" | "BLOCKED"; // Added BLOCKED
  manufactureDate?: string;
  dispatchDate?: string;
  product?: {
    name: string;
    brand: { name: string };
  };
  retailer?: {
    name: string;
  };
  warrantyId?: string;
  registeredBy?: string;
  createdAt: string;
}

// ✅ Added blocked to stats interface to match the updated Controller
export interface SerialStats {
  total: string | number;
  registered: string | number;
  unregistered: string | number;
  flagged: string | number;
  blocked: string | number; // Added this
}

export function useAdminSerials() {
  const [serials, setSerials] = useState<Serial[]>([]);
  const [stats, setStats] = useState<SerialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Fetch Serials & Stats ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both list and stats in parallel for speed
      const [listData, statsData] = await Promise.all([
        adminApiFetch<Serial[]>("/serials"),
        adminApiFetch<SerialStats>("/serials?type=stats"),
      ]);

      setSerials(listData || []);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to sync serial inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. Validate Single Serial (Search Bar) ---
  const validateSerial = async (query: string) => {
    if (!query) return null;
    try {
      setLoading(true);
      const result = await adminApiFetch<Serial>(`/serials?query=${query}`);
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Bulk Upload ---
  const uploadSerials = async (payload: {
    serials: string[];
    productId: string;
    batchId?: string;
    retailerId?: string;
    manufactureDate?: string;
    dispatchDate?: string;
  }) => {
    try {
      const result = await adminApiFetch<any>("/serials", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await fetchData(); // Refresh everything after upload
      return result;
    } catch (err: any) {
      throw new Error(err.message || "Bulk upload failed.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    serials,
    stats,
    loading,
    error,
    refresh: fetchData,
    validateSerial,
    uploadSerials,
  };
}
