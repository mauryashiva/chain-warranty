"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useTransferWarranty() {
  const [loading, setLoading] = useState(false);
  const { address: currentOwner } = useAuth();

  const transfer = async (warrantyId: string, toWallet: string) => {
    if (!currentOwner) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      const res = await fetch("/api/warranty/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warrantyId,
          fromWallet: currentOwner,
          toWallet,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Transfer failed");

      return result.data;
    } finally {
      setLoading(false);
    }
  };

  return { transfer, loading };
}
