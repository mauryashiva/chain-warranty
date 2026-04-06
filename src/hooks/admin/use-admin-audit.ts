"use client";

import { useState, useEffect } from "react";
import { getAuditLogs } from "@/lib/api/admin/audit";

export function useAdminAudit() {
  // ✅ FIX: Added <any[]> so TypeScript knows this isn't a "never[]" array
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (filters?: { adminId?: string; entity?: string }) => {
    try {
      setLoading(true);

      const data = await getAuditLogs(filters as Record<string, string>);
      setLogs(data as any[]);
    } catch (error) {
      console.error("Fetch Audit Logs Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, filterLogs: fetchLogs };
}
