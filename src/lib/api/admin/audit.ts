import { adminApiFetch } from "../client";
import { endpoints } from "../endpoints";

/**
 * 📋 Get all admin audit logs with optional filters
 */
export function getAuditLogs(filters?: Record<string, string>) {
  const params = filters ? new URLSearchParams(filters).toString() : "";
  const query = params ? `?${params}` : "";

  return adminApiFetch(`${endpoints.admin.audit}${query}`);
}
