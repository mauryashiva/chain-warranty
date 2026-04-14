"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export interface Claim {
  id: string;
  claimNumber: string;
  warrantyId: string;
  productId: string;
  userId: string;
  type: "REPAIR" | "REPLACEMENT" | "REFUND";
  status:
    | "PENDING"
    | "IN_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "RESOLVED"
    | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  subject: string;
  description: string;
  fraudScore: number;
  isFraud: boolean;
  assignedTo?: string;
  createdAt: string;
  product: { name: string; sku: string };
  user: { name: string; email: string };
  _count?: {
    documents: number;
  };
}

export function useAdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 📜 Fetch Claims Registry
   * Supports filtering by status for the Dashboard Tabs
   */
  const fetchClaims = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string professionally
      const query = status && status !== "ALL" ? `?status=${status}` : "";
      const url = `${endpoints.admin.claims}${query}`;

      const data = await adminApiFetch<Claim[]>(url);
      setClaims(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to sync claim registry.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔄 Update Claim Status & Assign Admin
   * This handles the 'Review', 'Assign', and 'Resolve' actions
   */
  const updateClaimStatus = async (
    claimId: string,
    status: Claim["status"],
    adminId: string,
    note: string,
  ) => {
    try {
      setError(null);
      const result = await adminApiFetch(endpoints.admin.claims, {
        method: "PATCH",
        body: JSON.stringify({
          claimId,
          status,
          adminId,
          note,
        }),
      });

      // Refreshing the list ensures the Fraud Score and Logs are updated correctly
      await fetchClaims();
      return result;
    } catch (err: any) {
      const msg = err.message || "Failed to update claim state.";
      setError(msg);
      throw new Error(msg);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return {
    claims,
    loading,
    error,
    updateClaimStatus,
    refresh: fetchClaims,
  };
}
