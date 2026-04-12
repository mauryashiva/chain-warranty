"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, ShieldOff, AlertOctagon } from "lucide-react";

export type RetailerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

interface RetailerStatusBadgeProps {
  status: RetailerStatus;
}

export default function RetailerStatusBadge({
  status,
}: RetailerStatusBadgeProps) {
  const config = {
    ACTIVE: {
      label: "Active",
      icon: CheckCircle2,
      classes:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    },
    INACTIVE: {
      label: "Inactive",
      icon: ShieldOff,
      classes:
        "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400",
    },
    SUSPENDED: {
      label: "Suspended",
      icon: AlertOctagon,
      classes:
        "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    },
  };

  const { label, icon: Icon, classes } = config[status] || config.INACTIVE;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
        classes,
      )}
    >
      <Icon size={12} strokeWidth={3} />
      {label}
    </div>
  );
}
