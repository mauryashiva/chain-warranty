"use client";

import { cn } from "@/lib/utils";
import { Circle, CheckCircle2, AlertTriangle, Octagon } from "lucide-react";

export type SerialStatus =
  | "UNREGISTERED"
  | "REGISTERED"
  | "FLAGGED"
  | "BLOCKED";

interface SerialStatusBadgeProps {
  status: SerialStatus;
}

export default function SerialStatusBadge({ status }: SerialStatusBadgeProps) {
  const config = {
    UNREGISTERED: {
      label: "Unregistered",
      icon: Circle,
      classes:
        "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400",
    },
    REGISTERED: {
      label: "Registered",
      icon: CheckCircle2,
      classes:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    },
    FLAGGED: {
      label: "Flagged",
      icon: AlertTriangle,
      classes:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    },
    BLOCKED: {
      label: "Blocked",
      icon: Octagon,
      classes:
        "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    },
  };

  const { label, icon: Icon, classes } = config[status] || config.UNREGISTERED;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
        classes,
      )}
    >
      <Icon size={10} strokeWidth={3} />
      {label}
    </div>
  );
}
