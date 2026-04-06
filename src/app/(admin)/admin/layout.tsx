"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/layout/Sidebar";
import Topbar from "@/components/admin/layout/Topbar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar - Remains fixed to the left */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Wrapper for the rest of the content */}
      <div
        className={cn(
          "transition-all duration-300 min-h-screen flex flex-col",
          isOpen ? "ml-72" : "ml-20",
        )}
      >
        {/* Topbar - Usually h-20 */}
        <Topbar isOpen={isOpen} />

        {/* 🔥 THE FIX:
          We changed pt-20 (80px) to pt-32 (128px).
          Since the Topbar is 80px tall, this leaves a perfect 48px (3rem) 
          gap before your page content starts.
        */}
        <main className="flex-1 pt-32 px-8 pb-12">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
