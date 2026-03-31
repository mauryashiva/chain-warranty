"use client";

import { useEffect, useState } from "react";

type Warranty = {
  id: string;
  tokenId: string;
  productId: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch initial data
  const fetchWarranties = async () => {
    try {
      const res = await fetch("/api/warranty");
      const data = await res.json();
      setWarranties(data);
    } catch (error) {
      console.error("Error fetching warranties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  // 🔥 SSE listener
  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);

      console.log("Realtime event:", parsed);

      // 🟢 Warranty Created
      if (parsed.type === "WARRANTY_CREATED") {
        setWarranties((prev) => [
          {
            id: parsed.data.warrantyId,
            tokenId: parsed.data.tokenId,
            productId: "New Product",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      // 🔁 Warranty Transferred
      if (parsed.type === "WARRANTY_TRANSFERRED") {
        alert("Warranty transferred successfully!");
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">
        Warranty Dashboard (Real-Time)
      </h1>

      <div className="grid gap-4">
        {warranties.map((w) => (
          <div
            key={w.id}
            className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
          >
            <p className="text-sm text-gray-400">Warranty ID</p>
            <p className="font-mono">{w.id}</p>

            <p className="text-sm text-gray-400 mt-2">Token ID</p>
            <p>{w.tokenId}</p>

            <p className="text-sm text-gray-400 mt-2">Product</p>
            <p>{w.productId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
