"use client";

import { useState } from "react";
import {
  ShieldCheck,
  RefreshCw,
  Lock,
  Zap,
  Smartphone,
  Fingerprint,
  Clock,
} from "lucide-react";
import PolicyCard from "./PolicyCard";
import { cn } from "@/lib/utils";

interface GlobalSettingsProps {
  initialData: any;
  onUpdate: (updatedConfig: any) => Promise<void>;
}

export default function GlobalSettings({
  initialData,
  onUpdate,
}: GlobalSettingsProps) {
  const [config, setConfig] = useState(
    initialData || {
      allowRegistrationAfterPurchase: true,
      maxDaysToRegister: 30,
      autoExpireNft: true,
      allowTransfer: true,
      requireOtpForTransfer: true,
      requireIdProofForTransfer: false,
      allowTransferWithOpenClaim: false,
    },
  );

  const updateConfig = (key: string, value: any) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    onUpdate(updated); // Triggers the high-level API sync
  };

  // Upgraded Section Label to act as a clear structural divider
  const sectionLabelClasses =
    "text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 mb-6 pb-4 border-b border-slate-200 dark:border-gray-800 block w-full";

  return (
    <div className="p-6 md:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- REGISTRATION PROTOCOL --- */}
      <section className="relative">
        <span className={sectionLabelClasses}>Registration Protocol</span>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PolicyCard
            icon={<Zap size={20} className="text-blue-600" />}
            title="Post-Purchase Registration"
            description="Allows customers to register units after purchase. If disabled, units are locked to the retailer."
            isActive={config.allowRegistrationAfterPurchase}
            onToggle={() =>
              updateConfig(
                "allowRegistrationAfterPurchase",
                !config.allowRegistrationAfterPurchase,
              )
            }
          >
            {config.allowRegistrationAfterPurchase && (
              <div className="flex items-center gap-4 mt-6 bg-slate-100/50 dark:bg-gray-800/50 p-4 rounded-[1.25rem] border border-slate-200 dark:border-gray-700 w-fit animate-in zoom-in-95 duration-300 shadow-sm">
                <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl text-blue-600 shadow-sm">
                  <Clock size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest opacity-80 mb-1">
                    Registration Window
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={config.maxDaysToRegister}
                      onChange={(e) =>
                        updateConfig(
                          "maxDaysToRegister",
                          Math.max(0, parseInt(e.target.value) || 0),
                        )
                      }
                      className="w-14 bg-transparent text-sm font-black text-blue-600 outline-none border-b-2 border-blue-600/20 focus:border-blue-600 transition-all text-center pb-0.5"
                    />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      Days
                    </span>
                  </div>
                </div>
              </div>
            )}
          </PolicyCard>

          <PolicyCard
            icon={<ShieldCheck size={20} className="text-emerald-500" />}
            title="Auto-Expire NFT Status"
            description="Updates Blockchain NFT status to 'Expired' automatically upon warranty completion."
            isActive={config.autoExpireNft}
            onToggle={() =>
              updateConfig("autoExpireNft", !config.autoExpireNft)
            }
          />
        </div>
      </section>

      {/* --- SECONDARY MARKET & SECURITY --- */}
      <section className="relative">
        <span className={sectionLabelClasses}>Secondary Market & Security</span>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PolicyCard
            icon={<RefreshCw size={20} className="text-indigo-500" />}
            title="Peer-to-Peer Transfer"
            description="Enables the 'Transfer Warranty' feature, allowing owners to move NFTs to new buyers."
            isActive={config.allowTransfer}
            onToggle={() =>
              updateConfig("allowTransfer", !config.allowTransfer)
            }
          />

          <PolicyCard
            icon={<Smartphone size={20} className="text-blue-500" />}
            title="SMS OTP Verification"
            description="Requires a secure 6-digit OTP sent to the registered mobile before any transfer is authorized."
            isActive={config.requireOtpForTransfer}
            onToggle={() =>
              updateConfig(
                "requireOtpForTransfer",
                !config.requireOtpForTransfer,
              )
            }
          />

          <PolicyCard
            icon={<Fingerprint size={20} className="text-amber-500" />}
            title="ID Proof Requirement"
            description="Require government ID upload for high-value warranty transfers to prevent fraud."
            isActive={config.requireIdProofForTransfer}
            onToggle={() =>
              updateConfig(
                "requireIdProofForTransfer",
                !config.requireIdProofForTransfer,
              )
            }
          />

          <PolicyCard
            icon={<Lock size={20} className="text-rose-500" />}
            title="Block Transfer on Open Claim"
            description="Prevents warranty transfer if a repair or replacement claim is currently in progress."
            isActive={config.allowTransferWithOpenClaim}
            onToggle={() =>
              updateConfig(
                "allowTransferWithOpenClaim",
                !config.allowTransferWithOpenClaim,
              )
            }
          />
        </div>
      </section>
    </div>
  );
}
