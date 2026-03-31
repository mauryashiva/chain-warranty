"use client";

import { useEffect, useState } from "react";
import { useWarrantyStore } from "@/store/useWarrantyStore";
import { WarrantyCard } from "@/components/ui/WarrantyCard";
import Link from "next/link";

export default function Dashboard() {
  const { warranties, setWarranties } = useWarrantyStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWarranties() {
      try {
        const res = await fetch("/api/warranty");
        const json = await res.json();
        if (json.success) setWarranties(json.data);
      } finally {
        setLoading(false);
      }
    }
    fetchWarranties();
  }, [setWarranties]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Assets</h2>
          <p className="text-sm text-slate-500">Secure on-chain warranties</p>
        </div>
        <Link
          href="/mint"
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-transform"
        >
          <PlusIcon />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {warranties.map((w) => (
            <WarrantyCard
              key={w.id}
              tokenId={w.tokenId}
              productName={w.product.name}
              expiryDate={w.expiryDate}
              status={w.status}
            />
          ))}
          {warranties.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400">No warranties found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
