import React from "react";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-md min-h-screen flex flex-col shadow-xl border-x border-slate-200 dark:border-slate-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex justify-between items-center border-b border-slate-100 dark:border-slate-900">
        <h1 className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          ChainWarranty
        </h1>
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

      {/* Bottom Mobile Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
        <NavIcon label="Home" active />
        <NavIcon label="Scan" />
        <NavIcon label="Transfer" />
        <NavIcon label="Settings" />
      </nav>
    </div>
  );
}

function NavIcon({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 ${active ? "text-indigo-600" : "text-slate-400 dark:text-slate-500"}`}
    >
      <div
        className={`w-6 h-6 rounded-md ${active ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-slate-100 dark:bg-slate-800"}`}
      />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
