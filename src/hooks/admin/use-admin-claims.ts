"use client";

import { useState, useEffect } from "react";

export function useAdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/claims");
      const json = await res.json();
      setClaims(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const resolveClaim = async (
    claimId: string,
    status: string,
    note: string,
  ) => {
    const res = await fetch("/api/admin/claims/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimId, status, note }),
    });
    if (!res.ok) throw new Error("Failed to resolve claim");
    fetchClaims();
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return { claims, loading, resolveClaim, refresh: fetchClaims };
}
