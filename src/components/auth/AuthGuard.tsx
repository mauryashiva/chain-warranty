"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { address, isMounted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && !address) {
      router.push("/login");
    }
  }, [address, isMounted, router]);

  if (!isMounted || !address) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
