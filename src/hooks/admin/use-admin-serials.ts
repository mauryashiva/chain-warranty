"use client";

import { useState } from "react";

export function useAdminSerials() {
  const [isValidating, setIsValidating] = useState(false);

  const uploadBulkSerials = async (productId: string, serials: string[]) => {
    const res = await fetch("/api/admin/serials/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, serials }),
    });
    return await res.json();
  };

  const validateSerial = async (serialNumber: string) => {
    setIsValidating(true);
    try {
      const res = await fetch(
        `/api/admin/serials/verify?number=${serialNumber}`,
      );
      return await res.json();
    } finally {
      setIsValidating(false);
    }
  };

  return { uploadBulkSerials, validateSerial, isValidating };
}
