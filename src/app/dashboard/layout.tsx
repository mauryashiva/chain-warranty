"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Sidebar - Width handled by isCollapsed state */}
      <Sidebar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />

      {/* Right section */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-black/80">
          <Topbar />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-6 dark:bg-neutral-950">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
