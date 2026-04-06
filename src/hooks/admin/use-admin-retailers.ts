"use client";

import { useState, useEffect } from "react";

export function useAdminRetailers() {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRetailers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/retailers");
      const json = await res.json();
      setRetailers(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const addRetailer = async (data: {
    name: string;
    website?: string;
    location?: string;
  }) => {
    const res = await fetch("/api/admin/retailers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add retailer");
    fetchRetailers();
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  return { retailers, loading, refresh: fetchRetailers, addRetailer };
}
