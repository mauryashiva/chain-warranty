"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { transferWarranty } from "@/lib/api/user/warranty";

export function useTransferWarranty() {
  const [loading, setLoading] = useState(false);
  const { address: currentOwner } = useAuth();

  const transfer = async (warrantyId: string, toWallet: string) => {
    if (!currentOwner) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);

    try {
      const data = await transferWarranty({
        warrantyId,
        fromWallet: currentOwner,
        toWallet,
      });

      return data;
    } catch (error: any) {
      console.error("Transfer Warranty Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { transfer, loading };
}
