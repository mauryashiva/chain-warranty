"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AuthGuard from "@/components/auth/AuthGuard";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar state management
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Sidebar - Controlled by global state */}
      <Sidebar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar - Fixed Glassmorphism Header */}
        <header className="z-20 h-16 border-b-2 border-gray-100 bg-white/80 backdrop-blur-md dark:border-neutral-900 dark:bg-black/80">
          <Topbar />
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-6 transition-colors duration-300 dark:bg-neutral-950">
          {/* 🚀 AuthGuard Wrap: 
            This is the "Security Gate". It checks if the wallet 
            is connected before showing the dashboard content.
          */}
          <AuthGuard>
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </AuthGuard>
        </main>
      </div>
    </div>
  );
}
