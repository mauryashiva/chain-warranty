"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductStatusToggleProps {
  value: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
  onChange: (newValue: "ACTIVE" | "INACTIVE" | "DISCONTINUED") => void;
}

export default function ProductStatusToggle({
  value,
  onChange,
}: ProductStatusToggleProps) {
  const states = [
    {
      id: "ACTIVE",
      label: "Active",
      icon: CheckCircle2,
      color: "bg-emerald-500",
    },
    {
      id: "INACTIVE",
      label: "Inactive",
      icon: ShieldOff,
      color: "bg-amber-500",
    },
    { id: "DISCONTINUED", label: "Legacy", icon: Trash2, color: "bg-rose-500" },
  ];

  const activeIndex = states.findIndex((s) => s.id === value);

  return (
    <div className="relative flex bg-slate-100 dark:bg-gray-800/50 p-1 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-inner w-full max-w-md">
      {/* Animated Slider */}
      <motion.div
        className={cn(
          "absolute inset-y-1 left-1 rounded-xl shadow-md z-0",
          states[activeIndex].color,
        )}
        initial={false}
        animate={{ x: `${activeIndex * 100}%` }}
        style={{ width: "calc(33.33% - 2.6px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {states.map((state) => {
        const Icon = state.icon;
        const isSelected = value === state.id;
        return (
          <button
            key={state.id}
            type="button"
            onClick={() => onChange(state.id as any)}
            className={cn(
              "relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
              isSelected
                ? "text-white"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
            )}
          >
            <Icon size={14} strokeWidth={3} />
            <span>{state.label}</span>
          </button>
        );
      })}
    </div>
  );
}
