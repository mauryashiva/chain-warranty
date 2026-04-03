"use client";

import { useState, useEffect } from "react";
import { getWarranties } from "@/lib/api";

export function useWarranties() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const result = await getWarranties();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  return { data, loading, error, refresh: fetchWarranties };
}
