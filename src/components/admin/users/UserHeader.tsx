import { UserPlus } from "lucide-react";

export default function UserHeader({
  onInviteClick,
}: {
  onInviteClick: () => void;
}) {
  return (
    /* We ensure z-0 here so it never covers a modal backdrop */
    <div className="relative z-0 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-gray-800 pb-10">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
          Admin Governance
        </h1>
        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-2 uppercase tracking-[0.2em] opacity-80">
          Manage internal access and decentralized identity permissions
        </p>
      </div>

      <button
        onClick={onInviteClick}
        className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        <UserPlus size={16} strokeWidth={2.5} />
        Invite New Admin
      </button>
    </div>
  );
}
