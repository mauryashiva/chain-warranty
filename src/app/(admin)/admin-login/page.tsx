"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  ChevronRight,
  Loader2,
  AlertCircle,
  Fingerprint,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export default function AdminLoginPage() {
  const { setAddress } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const AUTHORIZED_ADMINS = [
    "0x114D8B5B53D1D612A5a82Bae1a9e143208f966ed",
    "0xYourSecondAdminAddressHere",
  ];

  useEffect(() => setMounted(true), []);

  const handleAdminLogin = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error(
          "MetaMask extension not detected. Please install and try again.",
        );
      }

      // Step 1: Connect Wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const connectedAddress = accounts[0];

      // Step 2: Authorization Check
      const isAdmin = AUTHORIZED_ADMINS.some(
        (admin) => admin.toLowerCase() === connectedAddress.toLowerCase(),
      );

      if (!isAdmin) {
        throw new Error(
          "Unauthorized access. This wallet is not permitted to access the admin console.",
        );
      }

      // Step 3: Signature Challenge
      const message = `ChainWarranty Admin Authentication\nSession Verification\nTimestamp: ${new Date().getTime()}\nNonce: ${Math.random()
        .toString(36)
        .substring(7)}`;

      await window.ethereum.request({
        method: "personal_sign",
        params: [message, connectedAddress],
      });

      // Step 4: Session Setup
      setAddress(connectedAddress);

      document.cookie = `admin_session=true; path=/; max-age=36000; SameSite=Lax`;
      document.cookie = `user=${connectedAddress}; path=/; max-age=36000; SameSite=Lax`;

      router.push("/admin");
    } catch (err: any) {
      if (err.code === 4001) {
        setError(
          "Authentication request was declined. Please approve the request in your wallet to continue.",
        );
      } else {
        console.error("Authentication Error:", err);
        setError(
          err.message ||
            "Authentication failed. Please verify your access credentials and try again.",
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4 transition-colors duration-500">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mask-[radial-gradient(ellipse_at_center,black,transparent)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-110"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex p-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl mb-6"
          >
            <ShieldCheck size={32} />
          </motion.div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Administrative Console
          </h1>

          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-[0.3em] mt-2">
            Secure Access Gateway
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-4xl p-8 md:p-10 shadow-2xl">
          {/* Status */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">
              <Fingerprint size={14} className="text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
                Verified Access Protocol
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-600 dark:text-zinc-400 uppercase">
                System Operational
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Administrator Verification
              </h2>

              <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                Connect your authorized wallet and complete the cryptographic
                signature challenge to establish a secure session.
              </p>
            </div>

            {/* Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-500"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-snug">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <button
              onClick={handleAdminLogin}
              disabled={isAuthenticating}
              className={cn(
                "w-full group flex items-center justify-between p-1.5 rounded-xl transition-all active:scale-[0.99] disabled:opacity-70",
                "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg shadow-black/10",
              )}
            >
              <span className="pl-5 text-xs font-bold uppercase tracking-widest">
                {isAuthenticating
                  ? "Establishing Secure Session..."
                  : "Authenticate with Wallet"}
              </span>

              <div className="bg-blue-600 p-3 rounded-lg text-white">
                {isAuthenticating ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ChevronRight size={18} strokeWidth={3} />
                )}
              </div>
            </button>

            {/* Divider */}
            <div className="pt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100 dark:bg-zinc-800" />
              <Lock size={12} className="text-gray-400" />
              <div className="h-px flex-1 bg-gray-100 dark:bg-zinc-800" />
            </div>

            {/* Footer Note */}
            <p className="text-[10px] text-center font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-tighter">
              All administrative actions are securely logged and immutable via
              <br />
              <span className="text-gray-900 dark:text-gray-300">
                ChainWarranty Security Infrastructure
              </span>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-[0.4em]">
            Restricted Administrative Access
          </p>
        </div>
      </motion.div>
    </div>
  );
}
