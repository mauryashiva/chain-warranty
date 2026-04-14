"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  role: "SUPER_ADMIN" | "BRAND_MANAGER" | "CLAIMS_AGENT" | "RETAILER_MANAGER";
  status: "ACTIVE" | "INACTIVE" | "REVOKED";
  lastLogin: string | null;
  twoFAEnabled: boolean;
}

export function useAdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApiFetch<AdminUser[]>(endpoints.admin.users);
      setAdmins(data || []);
    } catch (error: any) {
      console.error("Admin Registry Sync Failed:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  /**
   * ➕ Invite a new Admin (POST)
   */
  const inviteAdmin = async (payload: {
    name: string;
    email: string;
    walletAddress: string;
    role: string;
    invitedBy: string;
  }) => {
    try {
      const result = await adminApiFetch<AdminUser>(endpoints.admin.users, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setAdmins((prev) => [result, ...prev]);
      return { success: true };
    } catch (error: any) {
      console.error("Invite Error:", error.message);
      return { success: false, error: error.message };
    }
  };

  /**
   * 📝 Update Admin Details (PATCH - Blue Button)
   */
  const updateAdmin = async (adminId: string, payload: Partial<AdminUser>) => {
    try {
      const result = await adminApiFetch<AdminUser>(endpoints.admin.users, {
        method: "PATCH",
        body: JSON.stringify({ adminId, ...payload }),
      });

      setAdmins((prev) =>
        prev.map((a) => (a.id === adminId ? { ...result } : a)),
      );
      return { success: true };
    } catch (error: any) {
      console.error("Update Error:", error.message);
      return { success: false, error: error.message };
    }
  };

  /**
   * 🚫 Revoke Access (DELETE - Red Button)
   * Fixed: Matches your API route's DELETE method and query params
   */
  const revokeAdmin = async (adminId: string) => {
    try {
      // ✅ Using DELETE method and query params as expected by your route.ts
      await adminApiFetch(
        `${endpoints.admin.users}?adminId=${adminId}&performerId=SYSTEM_ADMIN`,
        {
          method: "DELETE",
        },
      );

      setAdmins((prev) =>
        prev.map((a) => (a.id === adminId ? { ...a, status: "REVOKED" } : a)),
      );
      return { success: true };
    } catch (error: any) {
      console.error("Revoke Error:", error.message);
      return { success: false };
    }
  };

  return {
    admins,
    loading,
    refresh: fetchAdmins,
    inviteAdmin,
    updateAdmin,
    revokeAdmin,
  };
}
