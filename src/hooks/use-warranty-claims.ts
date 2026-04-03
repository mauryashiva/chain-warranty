"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useWarrantyClaims() {
  const [loading, setLoading] = useState(false);
  const { address } = useAuth();

  const submitClaim = async (
    warrantyId: string,
    type: string,
    reason: string,
  ) => {
    if (!address) throw new Error("Please connect your wallet first.");

    setLoading(true);
    try {
      const res = await fetch("/api/claims", {
        // Ensure this API route exists
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warrantyId,
          userId: address, // Or the resolved userId from your Auth
          type,
          reason,
          status: "PENDING",
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit claim");

      return result.data;
    } finally {
      setLoading(false);
    }
  };

  return { submitClaim, loading };
}
