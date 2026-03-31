"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productId: "prod_iphone15", // Your validated Supabase ID
    walletAddress: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Minting Error:", err);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2 active:scale-90 transition-transform"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-3xl font-extrabold tracking-tight">New Warranty</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Mint a new NFT protection plan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
            Wallet Address
          </label>
          <input
            required
            placeholder="0x..."
            className="w-full bg-slate-100 dark:bg-slate-900 border-none p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-mono"
            value={formData.walletAddress}
            onChange={(e) =>
              setFormData({ ...formData, walletAddress: e.target.value })
            }
          />
        </div>

        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
            Expiry Date
          </label>
          <input
            type="date"
            required
            className="w-full bg-slate-100 dark:bg-slate-900 border-none p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            onChange={(e) =>
              setFormData({ ...formData, expiryDate: e.target.value })
            }
          />
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex justify-center items-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Minting NFT...
              </>
            ) : (
              "Create Warranty"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
