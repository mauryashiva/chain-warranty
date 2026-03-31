import { WarrantyStatus } from "@prisma/client";

interface Props {
  productName: string;
  expiryDate: Date;
  status: WarrantyStatus;
  tokenId: string;
}

export function WarrantyCard({
  productName,
  expiryDate,
  status,
  tokenId,
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 active:scale-[0.98] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            NFT ID #{tokenId}
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {productName}
          </h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
            status === "ACTIVE"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-end justify-between mt-6">
        <div>
          <p className="text-xs text-slate-400">Expires</p>
          <p className="text-sm font-medium dark:text-slate-300">
            {new Date(expiryDate).toLocaleDateString()}
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
