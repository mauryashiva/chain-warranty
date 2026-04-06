"use client";

import { useState, useEffect } from "react";
import { getWarranties } from "@/lib/api/user/warranty";

export function useWarranties() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getWarranties();
      setData(result as any[]);
    } catch (err: any) {
      console.error("Fetch Warranties Error:", err);
      setError(err.message || "Failed to fetch warranties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  return { data, loading, error, refresh: fetchWarranties };
}
