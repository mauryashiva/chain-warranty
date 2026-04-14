"use client";

import { cn } from "@/lib/utils";

interface PolicyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export default function PolicyCard({
  icon,
  title,
  description,
  isActive,
  onToggle,
  children,
}: PolicyCardProps) {
  return (
    <div
      className={cn(
        "relative p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden h-full flex flex-col",
        isActive
          ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none"
          : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100",
      )}
    >
      {/* Subtle Inner Highlight */}
      {isActive && (
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/3 to-transparent pointer-events-none" />
      )}

      {/* Main Content Wrapper - Ensures full width and proper spacing */}
      <div className="relative z-10 flex flex-row items-start justify-between w-full gap-4">
        {/* Left Group: Icon + Text */}
        <div className="flex gap-5 md:gap-6 items-start">
          {/* Refined Icon Container - Fixed square sizing */}
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 shadow-sm",
              isActive
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/20 dark:shadow-white/10"
                : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700",
            )}
          >
            <div
              className={cn(
                "transition-transform duration-500",
                isActive && "scale-110",
              )}
            >
              {icon}
            </div>
          </div>

          {/* Text Container */}
          <div className="flex flex-col pt-1.5 space-y-1.5">
            <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">
              {title}
            </h3>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-relaxed pr-2">
              {description}
            </p>
          </div>
        </div>

        {/* Right Group: Toggle Switch - Fixed rendering issues */}
        <div className="shrink-0 pt-2 pl-2">
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "relative flex items-center w-11 h-6 rounded-full transition-colors duration-500 active:scale-90 outline-none",
              isActive
                ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                : "bg-slate-300 dark:bg-slate-700",
            )}
          >
            <div
              className={cn(
                "w-5 h-5 bg-white rounded-full transition-transform duration-500 shadow-md",
                isActive ? "translate-x-5.5" : "translate-x-0.5",
              )}
            />
          </button>
        </div>
      </div>

      {/* Children Slot (e.g., Days Input) */}
      {children && (
        <div className="relative z-10 mt-6 md:ml-20 animate-in fade-in slide-in-from-top-2 duration-500">
          {children}
        </div>
      )}
    </div>
  );
}
