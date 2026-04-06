"use client";

import { useState, useEffect } from "react";

export function useAdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (filters?: { adminId?: string; entity?: string }) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/admin/audit?${params}`);
      const json = await res.json();
      setLogs(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, filterLogs: fetchLogs };
}
