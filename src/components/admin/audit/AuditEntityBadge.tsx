"use client";

import { cn } from "@/lib/utils";

interface AuditEntityBadgeProps {
  entity: string | undefined | null;
}

export default function AuditEntityBadge({ entity }: AuditEntityBadgeProps) {
  const getEntityStyles = () => {
    // Safety check fallback
    if (!entity) {
      return "bg-slate-50 dark:bg-gray-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-gray-700";
    }

    switch (entity.toUpperCase()) {
      case "CLAIM":
        // Critical Ops (Red/Rose)
        return "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-500 border-rose-200 dark:border-rose-800/50";

      case "SERIAL":
      case "ASSET":
        // Blockchain Assets (Purple/Indigo)
        return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-500 border-indigo-200 dark:border-indigo-800/50";

      case "PRODUCT":
      case "BRAND":
        // Catalog & Inventory (Blue)
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-800/50";

      case "WARRANTY_RULE":
      case "GLOBAL_CONFIG":
      case "SYSTEM":
        // Governance & Rules (Yellow/Amber)
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800/50";

      case "USER":
      case "RETAILER":
      case "ADMIN":
        // Access & People (Green/Emerald)
        return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800/50";

      default:
        // Default System Fallback (Gray/Slate)
        return "bg-slate-50 dark:bg-gray-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-gray-700";
    }
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm",
        getEntityStyles(),
      )}
    >
      {entity ? entity.replace(/_/g, " ") : "SYSTEM"}
    </span>
  );
}
