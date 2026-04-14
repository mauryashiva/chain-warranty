"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Hooks & Components
import { useAdminClaims, Claim } from "@/hooks/admin/use-admin-claims";
import ClaimsTable from "@/components/admin/claims/ClaimsTable";
import ClaimReviewModal from "@/components/admin/claims/ClaimReviewModal";

type TabStatus = "ALL" | "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED";

export default function ClaimsManagementPage() {
  const { claims, loading, error, refresh, updateClaimStatus } =
    useAdminClaims();
  const [activeTab, setActiveTab] = useState<TabStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // 🏛️ Modal State
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // 📊 Stats Calculation
  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "PENDING").length,
    inReview: claims.filter((c) => c.status === "IN_REVIEW").length,
    resolved: claims.filter((c) => c.status === "RESOLVED").length,
    rejected: claims.filter((c) => c.status === "REJECTED").length,
  };

  // 🔍 Filter Logic
  const filteredClaims = claims.filter((c) => {
    const matchesTab = activeTab === "ALL" || c.status === activeTab;
    const matchesSearch =
      c.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // 🔄 Handle Status Transition
  const handleUpdateClaim = async (id: string, status: any, note: string) => {
    const currentAdminId = "admin_01";
    await updateClaimStatus(id, status, currentAdminId, note);
  };

  if (loading && claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Retrieving Claims...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 px-6 md:px-10 pt-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-gray-800 pb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Claims Management
          </h1>
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-2 uppercase tracking-[0.2em]">
            Blockchain-Verified Warranty Resolution Center
          </p>
        </div>

        {/* 🛠️ FIXED TABS COMPONENT */}
        <div className="flex bg-slate-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-inner">
          {(
            [
              "ALL",
              "PENDING",
              "IN_REVIEW",
              "RESOLVED",
              "REJECTED",
            ] as TabStatus[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                activeTab === tab
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800",
              )}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          label="Total Claims"
          value={stats.total}
          icon={<FileText size={18} />}
          color="blue"
        />
        <StatsCard
          label="Open"
          value={stats.pending}
          icon={<Inbox size={18} />}
          color="amber"
        />
        <StatsCard
          label="Analysis"
          value={stats.inReview}
          icon={<Clock size={18} />}
          color="indigo"
        />
        <StatsCard
          label="Settled"
          value={stats.resolved}
          icon={<CheckCircle2 size={18} />}
          color="emerald"
        />
        <StatsCard
          label="Blocked"
          value={stats.rejected}
          icon={<ShieldAlert size={18} />}
          color="rose"
        />
      </div>

      {/* SEARCH & REFRESH BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
        <div className="relative w-full md:w-112.5 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300"
            size={16}
          />
          <input
            type="text"
            placeholder="Search claim ID, product, or user..."
            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-4 ring-blue-600/5 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => refresh()}
          className="flex items-center gap-2 px-6 py-4 bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 font-black text-[10px] uppercase tracking-widest group shadow-sm active:scale-95"
        >
          <RefreshCcw
            size={14}
            className="group-active:rotate-180 transition-transform duration-500"
          />
          Synchronize
        </button>
      </div>

      {/* TABLE LAYER */}
      <div className="bg-white dark:bg-gray-900/40 rounded-[2.5rem] border border-slate-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {error ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-rose-500" size={32} />
            </div>
            <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Critical Error: {error}
            </p>
          </div>
        ) : (
          <ClaimsTable
            claims={filteredClaims}
            onReview={(claim) => {
              setSelectedClaim(claim);
              setIsReviewOpen(true);
            }}
          />
        )}
      </div>

      {/* MODAL LAYER */}
      {selectedClaim && (
        <ClaimReviewModal
          isOpen={isReviewOpen}
          claim={selectedClaim}
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedClaim(null);
          }}
          onUpdateStatus={handleUpdateClaim}
        />
      )}
    </div>
  );
}

function StatsCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100/50",
    amber:
      "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100/50",
    indigo:
      "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100/50",
    emerald:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100/50",
    rose: "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-100/50",
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110",
          colorMap[color],
        )}
      >
        {icon}
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">
        {label}
      </p>
      <h3 className="text-4xl font-black text-slate-800 dark:text-slate-200 mt-1 tracking-tighter tabular-nums">
        {value}
      </h3>
    </div>
  );
}
