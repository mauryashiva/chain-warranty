"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Box,
  Hash,
  Store,
  Settings,
  ShieldCheck,
  History,
  X,
  Menu,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Brands", href: "/admin/brands", icon: Tag },
  { label: "Products", href: "/admin/products", icon: Box },
  { label: "Serial Numbers", href: "/admin/serials", icon: Hash },
  { label: "Retailers", href: "/admin/retailers", icon: Store },
  { label: "Warranty Rules", href: "/admin/warranty-rules", icon: Settings },
  { label: "Claims Management", href: "/admin/claims", icon: ShieldCheck },
  { label: "Admin Users", href: "/admin/users", icon: UserCircle },
  { label: "Audit Log", href: "/admin/audit", icon: History },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 transition-all duration-300",
        isOpen ? "w-72" : "w-20",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center justify-between">
          {isOpen && (
            <div className="animate-in fade-in duration-500">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                Admin Panel
              </p>
              <h1 className="text-sm font-black text-slate-900 dark:text-white">
                ChainWarranty
              </h1>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800",
              )}
            >
              <item.icon
                size={20}
                strokeWidth={pathname === item.href ? 3 : 2}
              />
              {isOpen && (
                <span className="animate-in slide-in-from-left-2">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
