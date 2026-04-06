"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Plus,
  Zap,
  BadgeCheck,
  Repeat,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const navigation = [
  {
    group: null,
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    group: "WARRANTY",
    items: [
      {
        name: "My Warranties",
        href: "/dashboard/warranties",
        icon: ShieldCheck,
      },
      { name: "Register Warranty", href: "/dashboard/register", icon: Plus },
    ],
  },
  {
    group: "BLOCKCHAIN",
    items: [
      { name: "Mint Warranty (NFT)", href: "/dashboard/mint", icon: Zap },
      { name: "Verify Warranty", href: "/dashboard/verify", icon: BadgeCheck },
    ],
  },
  {
    group: "HISTORY",
    items: [
      { name: "Transfers", href: "/dashboard/transfer", icon: Repeat },
      { name: "Claims", href: "/dashboard/claims", icon: ClipboardList },
    ],
  },
];

export default function Sidebar({ isCollapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  // ✅ Use Global Auth instead of local state
  const { address, isMounted } = useAuth();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r-2 border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-neutral-800 dark:bg-black",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Brand Logo & Toggle */}
      <div
        className={cn(
          "flex h-20 items-center border-b border-gray-100 px-6 dark:border-neutral-900",
          isCollapsed ? "justify-center px-0" : "justify-between",
        )}
      >
        <div
          className={cn("flex items-center gap-2.5", isCollapsed && "hidden")}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-xl shadow-blue-500/40">
            <ShieldCheck className="text-white" size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Chain<span className="text-blue-600">Warranty</span>
          </h1>
        </div>

        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border-2 border-transparent text-slate-950 transition-all hover:bg-slate-100 dark:text-white dark:hover:bg-neutral-900",
            isCollapsed &&
              "bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800",
          )}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={22} strokeWidth={2.5} />
          ) : (
            <PanelLeftClose size={22} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-4 px-3 py-6 overflow-y-auto custom-scrollbar">
        {navigation.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.group && !isCollapsed && (
              <div className="px-3 py-1 mb-2">
                <span className="inline-block rounded px-2 py-0.5 text-[10px] font-black tracking-[0.2em] bg-slate-100 text-slate-600 dark:bg-neutral-900 dark:text-neutral-400">
                  {section.group}
                </span>
              </div>
            )}

            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                    isCollapsed ? "justify-center" : "gap-3",
                    isActive
                      ? "bg-blue-600 text-white font-black shadow-[0_10px_20px_-5px_rgba(29,78,216,0.5)] scale-[1.02]"
                      : "text-slate-900 font-bold hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-neutral-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "shrink-0",
                      isActive
                        ? "text-white"
                        : "text-slate-950 dark:text-white group-hover:text-blue-600",
                    )}
                    size={20}
                    strokeWidth={isActive ? 3 : 2.5}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom section - Global Auth Integration */}
      <div className="border-t-2 border-gray-100 p-4 dark:border-neutral-900">
        <div
          className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-neutral-900/50",
            isCollapsed && "justify-center px-0 bg-transparent",
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-black shadow-md">
            <User size={18} strokeWidth={3} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-xs font-black text-slate-950 dark:text-white">
                {isMounted && address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Guest User"}
              </span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                {address ? "Verified Owner" : "v1.0 Stable"}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
