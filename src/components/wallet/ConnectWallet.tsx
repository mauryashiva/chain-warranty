"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  X,
  ArrowRight,
} from "lucide-react";

export default function ConnectWallet() {
  const [loading, setLoading] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const { setAddress, address } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);

      // 1. Check for Ethereum Provider
      if (typeof window === "undefined" || !(window as any).ethereum) {
        setShowInstallModal(true);
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);

      // 2. Request Accounts
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = ethers.getAddress(accounts[0]);
      const signer = await provider.getSigner();

      // 3. Get Nonce from Backend
      const nonceRes = await fetch("/api/auth/nonce");
      const { nonce } = await nonceRes.json();

      // 4. Create SIWE Message
      const message = new SiweMessage({
        domain: window.location.host,
        address: walletAddress,
        statement: "Sign in to ChainWarranty",
        uri: window.location.origin,
        version: "1",
        chainId: 1, // Change to 137 for Polygon or your specific ID
        nonce,
      });

      const messageString = message.prepareMessage();

      // 5. Request Signature
      const signature = await signer.signMessage(messageString);

      // 6. Verify with Backend
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ message, signature }),
        headers: { "Content-Type": "application/json" },
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "Authentication failed");
      }

      // 7. Success - Update Global State & Redirect
      setAddress(walletAddress);
      window.location.href = "/dashboard";
    } catch (err: any) {
      // Handle user cancellation gracefully
      if (err.code === "ACTION_REJECTED" || err.code === 4001) {
        console.log("User cancelled login.");
        return;
      }
      console.error("Login Error:", err);
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLogin}
        disabled={loading}
        className={cn(
          "group relative w-full overflow-hidden rounded-xl bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-xl transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white",
          loading && "cursor-wait",
        )}
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent"></span>
              AUTHENTICATING...
            </>
          ) : address ? (
            <>
              <ShieldCheck
                size={18}
                strokeWidth={3}
                className="text-emerald-400"
              />
              {address.slice(0, 6)}...{address.slice(-4)}
            </>
          ) : (
            <>
              CONNECT WALLET
              <ArrowRight
                size={16}
                strokeWidth={3}
                className="transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </div>
      </button>

      {/* --- PREMIUM INSTALL MODAL --- */}
      {showInstallModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 animate-in zoom-in-95 duration-300">
            {/* Background Decorative Element */}
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-600/5 blur-3xl" />

            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute right-6 top-6 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-neutral-900 dark:hover:text-white"
            >
              <X size={20} strokeWidth={3} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-4xl bg-blue-50 text-blue-600 shadow-inner dark:bg-blue-500/10 dark:text-blue-400">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>

              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Wallet Required
              </h3>
              <p className="mt-3 text-sm font-bold leading-relaxed text-slate-500 dark:text-neutral-400">
                To access ChainWarranty, you need a blockchain wallet like
                MetaMask installed in your browser.
              </p>

              <div className="mt-8 w-full space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 text-left dark:border-neutral-900 dark:bg-neutral-900/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-black">
                    <ShieldCheck size={20} strokeWidth={3} />
                  </div>
                  <p className="text-xs font-black text-slate-700 dark:text-neutral-300 uppercase tracking-tight">
                    Secure, passwordless login with your private keys.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex w-full flex-col gap-4">
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/30 transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  <Download size={18} strokeWidth={3} />
                  INSTALL METAMASK
                </a>

                <button
                  onClick={() => setShowInstallModal(false)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-950 dark:hover:text-white"
                >
                  Return to Login
                </button>
              </div>

              <div className="mt-8 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-neutral-700">
                <div className="h-px w-8 bg-slate-100 dark:bg-neutral-800" />
                <ExternalLink size={10} />
                Official Source
                <div className="h-px w-8 bg-slate-100 dark:bg-neutral-800" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
