"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useMintWarranty() {
  const [loading, setLoading] = useState(false);
  const { address: adminAddress } = useAuth();

  const executeMint = async (
    targetWallet: string,
    productId: string,
    expiryDate: string,
  ) => {
    if (!adminAddress) throw new Error("Admin wallet not connected");

    setLoading(true);
    try {
      const res = await fetch("/api/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: targetWallet, // The customer receiving the NFT
          productId,
          purchaseDate: new Date().toISOString(),
          expiryDate,
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Blockchain Minting Failed");

      return result.data;
    } finally {
      setLoading(false);
    }
  };

  return { executeMint, loading };
}
