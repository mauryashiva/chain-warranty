"use client";

import { useState } from "react";
import { verifyWarranty } from "@/lib/api/user/warranty";

type VerifyWarrantyResponse = {
  valid?: boolean;
  [key: string]: any;
};

export function useVerifyWarranty() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [result, setResult] = useState<VerifyWarrantyResponse | null>(null);

  const verify = async (tokenId: string) => {
    if (!tokenId) return;

    setStatus("loading");

    try {
      const data = (await verifyWarranty(tokenId)) as VerifyWarrantyResponse;

      if (data?.valid) {
        setResult(data);
        setStatus("success");
      } else {
        setResult(data);
        setStatus("error");
      }
    } catch (err) {
      console.error("Verify Warranty Error:", err);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setResult(null);
  };

  return { verify, status, result, reset };
}
