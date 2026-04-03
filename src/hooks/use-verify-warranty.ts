"use client";

import { useState } from "react";

export function useVerifyWarranty() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<any>(null);

  const verify = async (tokenId: string) => {
    if (!tokenId) return;

    setStatus("loading");
    try {
      const res = await fetch(`/api/verify?tokenId=${tokenId}`);
      const data = await res.json();

      if (data.valid) {
        setResult(data);
        setStatus("success");
      } else {
        setResult(data);
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setResult(null);
  };

  return { verify, status, result, reset };
}
