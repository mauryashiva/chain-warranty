"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  address: string | null;
  setAddress: (addr: string | null) => void;
  logout: () => void;
  isMounted: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Handle Initial Load & Persistence
  useEffect(() => {
    const saved = localStorage.getItem("wallet");
    if (saved) setAddress(saved);
    setIsMounted(true);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (isMounted) {
      if (address) {
        localStorage.setItem("wallet", address);
      } else {
        localStorage.removeItem("wallet");
      }
    }
  }, [address, isMounted]);

  const logout = () => {
    setAddress(null);
    // Remove cookie if using SIWE middleware
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ address, setAddress, logout, isMounted }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
