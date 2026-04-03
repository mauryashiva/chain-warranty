"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useRegisterWarranty() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { address } = useAuth();

  const register = async (productId: string, expiryDate: string) => {
    setIsRegistering(true);
    try {
      const res = await fetch("/api/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // For registration, the target wallet is ALWAYS the logged-in user
        body: JSON.stringify({
          walletAddress: address,
          productId,
          purchaseDate: new Date().toISOString(),
          expiryDate,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration Failed");
      return result.data;
    } finally {
      setIsRegistering(false);
    }
  };

  return { register, isRegistering };
}
