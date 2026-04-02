import { Plus, AlertCircle, RefreshCcw, ShieldCheck } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import WarrantyList from "@/components/dashboard/WarrantyList";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import VerifyCard from "@/components/dashboard/VerifyCard";
import { warrantyService } from "@/server/services/warranty.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  // --- SERVER-SIDE AUTH CHECK ---
  // We check the 'user' cookie set by your SIWE verify API.
  // This prevents the page from even loading if the user isn't authenticated.
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    redirect("/login");
  }

  let warranties: any[] = [];
  let buildError = "";

  try {
    // Fetching data from the server service
    warranties = (await warrantyService.getAll()) || [];
  } catch (error: any) {
    console.error("Dashboard load error", error);
    buildError = error?.message ?? "Failed to connect to the warranty service";
  }

  const now = new Date();

  // --- Logic for Dashboard Stats ---
  const stats = {
    totalWarranties: warranties.length,
    activeWarranties: warranties.filter((item) => item.status === "ACTIVE")
      .length,
    totalTransfers: warranties.reduce(
      (acc, item) => acc + (item.transfers?.length ?? 0),
      0,
    ),
    expiringSoon: warranties.filter((item) => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      const diffDays =
        (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays > 0 && diffDays <= 30;
    }).length,
  };

  // --- Logic for Activity Feed Events ---
  const events = warranties
    .flatMap((item) =>
      (item.events ?? []).map((ev: any) => ({
        id: `${item.id}-${ev.id}`,
        title: `${item.product?.name ?? "Product"} ${ev.type.toLowerCase()}`,
        subtitle: `Token #${item.tokenId} · ${ev.type}`,
        time: new Date(ev.createdAt || Date.now()).toLocaleString(),
      })),
    )
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);

  // --- Error State UI ---
  if (buildError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] rounded-[2.5rem] border-2 border-rose-100 bg-white p-12 text-center dark:border-rose-900/20 dark:bg-black shadow-2xl shadow-rose-500/5">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-4xl bg-rose-600 text-white shadow-xl shadow-rose-500/40">
          <AlertCircle size={40} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          Connection Interrupted
        </h2>
        <p className="mt-3 max-w-sm text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
          {buildError}. Please ensure your database or blockchain node is
          reachable.
        </p>
        <button className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-950 px-10 py-4 text-xs font-black text-white transition-all hover:bg-blue-600 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white shadow-lg">
          <RefreshCcw size={18} strokeWidth={3} />
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 lg:p-8">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
            <ShieldCheck size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Network Active
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white">
            System Overview
          </h1>
          <p className="mt-2 text-base font-bold text-slate-500 dark:text-neutral-400">
            Real-time management for your blockchain-verified product
            warranties.
          </p>
        </div>

        <button className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 text-sm font-black text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
          <Plus size={20} strokeWidth={4} />
          ISSUE NEW WARRANTY
        </button>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="w-full">
        <StatsCards stats={stats} />
      </div>

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Left Column: Warranty List (8 units wide) */}
        <div className="lg:col-span-8 space-y-10">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-linear-to-r from-blue-600 to-indigo-600 opacity-[0.03] blur transition duration-1000 group-hover:opacity-[0.07]" />
            <div className="relative">
              <WarrantyList warranties={warranties} />
            </div>
          </div>
        </div>

        {/* Right Column: Verify & Activity (4 units wide) */}
        <div className="lg:col-span-4 space-y-10">
          <section className="sticky top-24 space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
            <VerifyCard />
            <ActivityFeed events={events} />
          </section>
        </div>
      </div>
    </div>
  );
}
