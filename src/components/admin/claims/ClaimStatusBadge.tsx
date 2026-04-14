"use client";

import { cn } from "@/lib/utils";
import { Clock, Search, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

type ClaimStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "RESOLVED"
  | "CANCELLED";

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export default function ClaimStatusBadge({
  status,
  className,
}: ClaimStatusBadgeProps) {
  const statusConfig: Record<
    ClaimStatus,
    { label: string; color: string; icon: any }
  > = {
    PENDING: {
      label: "Pending",
      color:
        "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
      icon: <Clock size={11} strokeWidth={3} />,
    },
    IN_REVIEW: {
      label: "Analysis",
      color:
        "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
      icon: <Search size={11} strokeWidth={3} />,
    },
    APPROVED: {
      label: "Approved",
      color:
        "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
      icon: <CheckCircle2 size={11} strokeWidth={3} />,
    },
    REJECTED: {
      label: "Blocked",
      color:
        "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
      icon: <XCircle size={11} strokeWidth={3} />,
    },
    RESOLVED: {
      label: "Settled",
      color:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
      icon: <CheckCircle2 size={11} strokeWidth={3} />,
    },
    CANCELLED: {
      label: "Void",
      color:
        "bg-slate-500/10 text-slate-800 dark:text-slate-200 border-slate-500/20 hover:bg-slate-500/20",
      icon: <RotateCcw size={11} strokeWidth={3} />,
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div
      className={cn(
        // SaaS Standard Layout
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-200 cursor-default",
        // Consistent Text Formatting (800/200 logic handled per status for contrast)
        "text-[9px] font-black uppercase tracking-widest",
        config.color,
        className,
      )}
    >
      <span className="shrink-0 opacity-80">{config.icon}</span>
      <span className="leading-none">{config.label}</span>
    </div>
  );
}
