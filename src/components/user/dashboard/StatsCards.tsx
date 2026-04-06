"use client";

import {
  ShieldCheck,
  Boxes,
  Repeat,
  Clock,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatsCardsProps = {
  stats: StatsCardsPropsData;
};

type StatsCardsPropsData = {
  totalWarranties: number;
  activeWarranties: number;
  totalTransfers: number;
  expiringSoon: number;
};

type CardColor = "emerald" | "blue" | "violet" | "amber";

interface CardItem {
  title: string;
  value: number;
  icon: LucideIcon;
  color: CardColor;
}

export default function StatsCards({ stats }: { stats: StatsCardsPropsData }) {
  const cards: CardItem[] = [
    {
      title: "Active Warranties",
      value: stats.activeWarranties,
      icon: ShieldCheck,
      color: "emerald",
    },
    {
      title: "Total NFTs",
      value: stats.totalWarranties,
      icon: Boxes,
      color: "blue",
    },
    {
      title: "Transfers",
      value: stats.totalTransfers,
      icon: Repeat,
      color: "violet",
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      icon: Clock,
      color: "amber",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} {...card} />
      ))}
    </div>
  );
}

function Card({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  color: CardColor;
}) {
  const themes = {
    emerald:
      "text-emerald-700 bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 dark:text-emerald-400",
    blue: "text-blue-700 bg-blue-500/10 border-blue-300 dark:border-blue-500/30 dark:text-blue-400",
    violet:
      "text-violet-700 bg-violet-500/10 border-violet-300 dark:border-violet-500/30 dark:text-violet-400",
    amber:
      "text-amber-700 bg-amber-500/10 border-amber-300 dark:border-amber-500/30 dark:text-amber-400",
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-black">
      {/* Background Glow Effect */}
      <div
        className={cn(
          "absolute -right-2 -top-2 h-16 w-16 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
          color === "emerald" && "bg-emerald-500",
          color === "blue" && "bg-blue-500",
          color === "violet" && "bg-violet-500",
          color === "amber" && "bg-amber-500",
        )}
      />

      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-105",
            themes[color],
          )}
        >
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <ArrowUpRight
          size={16}
          className="text-slate-400 transition-colors group-hover:text-slate-900 dark:text-neutral-600 dark:group-hover:text-neutral-200"
        />
      </div>

      <div className="mt-3">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-950 dark:text-slate-100">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-black tracking-tight text-black dark:text-white">
            {value.toLocaleString()}
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            +2.5%
          </span>
        </div>
      </div>
    </div>
  );
}
