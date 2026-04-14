"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

// ✅ Interfaces matching your professional Schema
export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action:
    | "BRAND_CREATE"
    | "BRAND_UPDATE"
    | "PRODUCT_CREATE"
    | "PRODUCT_UPDATE"
    | "SERIAL_UPLOAD"
    | "RULE_CHANGE"
    | "CLAIM_STATUS_CHANGE"
    | "RETAILER_ADD"
    | "USER_INVITE"
    | "SYSTEM_CONFIG_CHANGE";
  entity:
    | "BRAND"
    | "PRODUCT"
    | "SERIAL"
    | "RETAILER"
    | "CLAIM"
    | "WARRANTY_RULE"
    | "GLOBAL_CONFIG"
    | "USER";
  entityId: string | null;
  entityName: string | null;
  details: string;
  oldValue: any;
  newValue: any;
  txHash: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export function useAdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 📜 Fetch Audit Logs with Filters
   */
  const fetchLogs = useCallback(
    async (filters: { action?: string; entity?: string } = {}) => {
      try {
        setLoading(true);
        setError(null);

        // Construct query params
        const params = new URLSearchParams();
        if (filters.action && filters.action !== "ALL")
          params.append("action", filters.action);
        if (filters.entity) params.append("entity", filters.entity);

        const queryString = params.toString();
        const url = queryString
          ? `${endpoints.admin.audit}?${queryString}`
          : endpoints.admin.audit;

        const data = await adminApiFetch<AuditLog[]>(url);
        setLogs(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to synchronise audit registry.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial load
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /**
   * 📥 Export to CSV (Standard for Audit Logs)
   */
  const exportToCSV = () => {
    if (logs.length === 0) return;

    const headers = [
      "Timestamp",
      "Admin",
      "Action",
      "Entity",
      "Details",
      "TX Hash",
    ];
    const rows = logs.map((log) => [
      new Date(log.createdAt).toLocaleString(),
      log.adminName,
      log.action,
      log.entityName || "N/A",
      log.details,
      log.txHash || "—",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    logs,
    loading,
    error,
    refresh: fetchLogs,
    exportToCSV,
  };
}
