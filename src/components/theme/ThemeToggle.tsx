"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevents hydration mismatch error
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-48 rounded-full border-2 border-gray-200 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900" />
    );
  }

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className="flex items-center gap-1 rounded-full border-2 border-gray-200 bg-slate-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;

        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "relative flex items-center justify-center rounded-full px-4 py-2 transition-all duration-300",
              isActive
                ? "bg-white text-blue-600 shadow-lg ring-2 ring-blue-100 dark:bg-black dark:text-blue-400 dark:ring-blue-900/30"
                : "text-slate-950 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-neutral-800",
            )}
            title={`Switch to ${opt.label} mode`}
          >
            <Icon
              size={16}
              strokeWidth={isActive ? 3 : 2.5}
              className={cn(
                "mr-2",
                isActive
                  ? "animate-in zoom-in-90 duration-300"
                  : "text-slate-950 dark:text-white",
              )}
            />
            <span
              className={cn(
                "text-xs tracking-tight",
                isActive ? "font-black" : "font-bold",
              )}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
