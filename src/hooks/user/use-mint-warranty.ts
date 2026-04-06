"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createWarranty } from "@/lib/api/user/warranty";

export function useMintWarranty() {
  const [loading, setLoading] = useState(false);
  const { address: adminAddress } = useAuth();

  const executeMint = async (
    targetWallet: string,
    productId: string,
    expiryDate: string,
  ) => {
    if (!adminAddress) {
      throw new Error("Admin wallet not connected");
    }

    setLoading(true);

    try {
      const data = await createWarranty({
        walletAddress: targetWallet,
        productId,
        purchaseDate: new Date().toISOString(),
        expiryDate,
      });

      return data;
    } catch (error: any) {
      console.error("Mint Warranty Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { executeMint, loading };
}
