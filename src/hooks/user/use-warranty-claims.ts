"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClaim } from "@/lib/api/user/claims";

export function useWarrantyClaims() {
  const [loading, setLoading] = useState(false);
  const { address } = useAuth();

  const submitClaim = async (
    warrantyId: string,
    type: string,
    reason: string,
  ) => {
    if (!address) {
      throw new Error("Please connect your wallet first.");
    }

    setLoading(true);

    try {
      // Using your standard apiFetch wrapper via createClaim
      const data = await createClaim({
        warrantyId,
        userId: address, // Or the resolved userId from your Auth
        type,
        reason,
        status: "PENDING",
      });

      return data;
    } catch (error: any) {
      console.error("Submit Claim Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitClaim, loading };
}
