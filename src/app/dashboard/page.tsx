import { Plus } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import WarrantyList from "@/components/dashboard/WarrantyList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import VerifyCard from "@/components/dashboard/VerifyCard";
import { warrantyService } from "@/server/services/warranty.service";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  let warranties: any[] = [];
  let buildError = "";

  try {
    warranties = await warrantyService.getAll();
  } catch (error: any) {
    console.error("Dashboard load error", error);
    buildError = error?.message ?? "Failed to load warranty data";
  }

  const now = new Date();

  // Logic for stats
  const stats = {
    totalWarranties: warranties.length,
    activeWarranties: warranties.filter((item) => item.status === "ACTIVE")
      .length,
    totalTransfers: warranties.reduce(
      (acc, item) => acc + (item.transfers?.length ?? 0),
      0,
    ),
    expiringSoon: warranties.filter((item) => {
      const expiry = new Date(item.expiryDate);
      const diffDays =
        (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays > 0 && diffDays <= 30;
    }).length,
  };

  // Logic for activity events
  const events = warranties
    .flatMap((item) =>
      (item.events ?? []).map((ev: any) => ({
        id: `${item.id}-${ev.id}`,
        title: `${item.product?.name ?? "Warranty"} ${ev.type.toLowerCase()}`,
        subtitle: `Token #${item.tokenId} · ${ev.type}`,
        time: new Date(ev.createdAt).toLocaleString(),
      })),
    )
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);

  if (buildError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 rounded-2xl border-2 border-rose-200 bg-white p-8 text-center dark:border-rose-900/50 dark:bg-black">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-500/20">
          <Plus className="rotate-45" size={28} />
        </div>
        <h2 className="text-xl font-black text-slate-950 dark:text-white">
          System Error
        </h2>
        <p className="mt-2 max-w-xs text-sm font-bold text-slate-800 dark:text-slate-200">
          {buildError}
        </p>
        <button className="mt-6 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-black text-white transition-all hover:bg-black dark:bg-white dark:text-black dark:hover:bg-slate-200">
          Try Refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-2">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
            Manage and track your blockchain-verified warranties
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Issue New Warranty
        </button>
      </div>

      {/* Stats Section */}
      <div className="w-full">
        <StatsCards stats={stats} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: List Section (Spans 8/12) */}
        <div className="lg:col-span-8 space-y-8">
          <WarrantyList warranties={warranties} />
        </div>

        {/* Right Column: Verify & Activity (Spans 4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <VerifyCard />
          <ActivityFeed events={events} />
        </div>
      </div>
    </div>
  );
}
