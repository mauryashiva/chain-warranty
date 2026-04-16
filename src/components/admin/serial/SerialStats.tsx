import {
  BarChart3,
  CheckCircle2,
  Search,
  ShieldAlert,
  Ban,
} from "lucide-react";

export default function SerialStats({ stats }: { stats: any }) {
  const items = [
    {
      label: "Total serials",
      value: stats?.total,
      icon: <BarChart3 size={14} />,
    },
    {
      label: "Registered",
      value: stats?.registered,
      icon: <CheckCircle2 size={14} />,
    },
    {
      label: "Unregistered",
      value: stats?.unregistered,
      icon: <Search size={14} />,
    },
    {
      label: "Flagged",
      value: stats?.flagged,
      icon: <ShieldAlert size={14} />,
    },
    { label: "Blocked", value: stats?.blocked, icon: <Ban size={14} /> },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((s) => (
        <div
          key={s.label}
          className="bg-slate-50/50 dark:bg-gray-800/30 border border-slate-100 dark:border-gray-800 p-6 rounded-3xl group hover:border-blue-500/30 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3 opacity-60">
            <span className="text-slate-900 dark:text-white">{s.icon}</span>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
              {s.label}
            </p>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {s.value || "0"}
          </p>
        </div>
      ))}
    </div>
  );
}
