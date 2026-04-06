"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";

export default function Topbar({ isOpen }: { isOpen: boolean }) {
  const { address } = useAuth();
  const { theme, setTheme } = useTheme();

  const [showProfile, setShowProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useClickOutside(dropdownRef, () => setShowProfile(false));

  const handleLogout = () => {
    document.cookie =
      "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin-login");
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 h-20 flex items-center justify-between px-6 border-b backdrop-blur-xl transition-all duration-300",
        "bg-white/70 dark:bg-gray-900/70",
        isOpen ? "left-72" : "left-20",
        "right-0",
      )}
    >
      {/* 🔍 SEARCH */}
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            placeholder="Search brands, products, serials..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
              mounted && theme === "light"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-500",
            )}
          >
            <Sun size={14} />
            Light
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
              mounted && theme === "dark"
                ? "bg-gray-900 text-white shadow"
                : "text-gray-500",
            )}
          >
            <Moon size={14} />
            Dark
          </button>

          <button
            onClick={() => setTheme("system")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
              mounted && theme === "system"
                ? "bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow"
                : "text-gray-500",
            )}
          >
            <Monitor size={14} />
            System
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={18} className="text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="h-9 w-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold">
              {address ? address.slice(2, 4).toUpperCase() : "A"}
            </div>

            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Admin"}
            </span>

            <ChevronDown
              size={14}
              className={cn(
                "transition-transform text-gray-500",
                showProfile && "rotate-180",
              )}
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
