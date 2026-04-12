"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusToggleProps {
  value: "ACTIVE" | "INACTIVE";
  onChange: (newValue: "ACTIVE" | "INACTIVE") => void;
}

export default function StatusToggle({ value, onChange }: StatusToggleProps) {
  return (
    <div className="relative flex bg-slate-100 dark:bg-gray-800/50 p-1 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-inner w-fit min-w-60">
      {/* ANIMATED SLIDER 
          We use x: value === "ACTIVE" ? 0 : "100%" 
          Note: Since the container has p-1, "100%" is safe as long as the 
          slider width is exactly half of the available internal space.
      */}
      <motion.div
        className={cn(
          "absolute inset-y-1 left-1 rounded-xl shadow-md z-0",
          value === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500",
        )}
        initial={false}
        animate={{
          // We subtract 8px (p-1 on both sides) from the total width calculation
          // internally, but x: "100%" works perfectly with flex-1 buttons.
          x: value === "ACTIVE" ? "0%" : "100%",
        }}
        // Using a width of calc(50% - 4px) ensures it doesn't hit the padding
        style={{ width: "calc(50% - 4px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {/* Active Button */}
      <button
        type="button"
        onClick={() => onChange("ACTIVE")}
        className={cn(
          "relative z-10 flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
          value === "ACTIVE"
            ? "text-white"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
        )}
      >
        <motion.div
          animate={{ scale: value === "ACTIVE" ? 1.05 : 1 }}
          className="flex items-center gap-2"
        >
          <CheckCircle2 size={14} strokeWidth={3} />
          <span>Active</span>
        </motion.div>
      </button>

      {/* Inactive Button */}
      <button
        type="button"
        onClick={() => onChange("INACTIVE")}
        className={cn(
          "relative z-10 flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
          value === "INACTIVE"
            ? "text-white"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
        )}
      >
        <motion.div
          animate={{ scale: value === "INACTIVE" ? 1.05 : 1 }}
          className="flex items-center gap-2"
        >
          <ShieldOff size={14} strokeWidth={3} />
          <span>Inactive</span>
        </motion.div>
      </button>
    </div>
  );
}
