"use client";

import { useState, useEffect } from "react";

export function useAdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      setAdmins(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const inviteAdmin = async (data: any) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to invite admin");
    fetchAdmins();
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { admins, loading, inviteAdmin, refresh: fetchAdmins };
}
