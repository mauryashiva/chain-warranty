import { cn } from "@/lib/utils";

interface AuditActionBadgeProps {
  action: string;
}

export default function AuditActionBadge({ action }: AuditActionBadgeProps) {
  // Format string from "BRAND_CREATE" to "BRAND CREATE"
  const formattedAction = action.replace(/_/g, " ");

  // Dynamic styling based on keywords in the action
  const getBadgeStyles = () => {
    // 1. Creations & Additions (Green)
    if (
      action.includes("CREATE") ||
      action.includes("ADD") ||
      action.includes("INVITE")
    ) {
      return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800/50";
    }

    // 2. System & Global Configs (Amber) - Placed before "CHANGE" so it takes priority
    if (action.includes("CONFIG") || action.includes("SYSTEM")) {
      return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800/50";
    }

    // 3. Standard Updates & Modifications (Blue)
    if (action.includes("UPDATE") || action.includes("CHANGE")) {
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-800/50";
    }

    // 4. Blockchain & Asset Uploads (Indigo)
    if (action.includes("UPLOAD") || action.includes("MINT")) {
      return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-500 border-indigo-200 dark:border-indigo-800/50";
    }

    // 5. Deletions & Failures (Red)
    if (
      action.includes("DELETE") ||
      action.includes("REVOKE") ||
      action.includes("FAIL")
    ) {
      return "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-500 border-rose-200 dark:border-rose-800/50";
    }

    // 6. Default fallback (Gray)
    return "bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-gray-700";
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
        getBadgeStyles(),
      )}
    >
      {formattedAction}
    </span>
  );
}
