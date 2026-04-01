"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  X,
} from "lucide-react";

export default function ConnectWallet() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (typeof window === "undefined" || !(window as any).ethereum) {
        setShowInstallModal(true);
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);

      // Attempt to connect
      const accounts = await provider.send("eth_requestAccounts", []);

      const walletAddress = ethers.getAddress(accounts[0]);
      const signer = await provider.getSigner();

      // Get nonce
      const nonceRes = await fetch("/api/auth/nonce");
      const { nonce } = await nonceRes.json();

      // SIWE Message
      const message = new SiweMessage({
        domain: window.location.host,
        address: walletAddress,
        statement: "Sign in to ChainWarranty",
        uri: window.location.origin,
        version: "1",
        chainId: 1,
        nonce,
      });

      const messageString = message.prepareMessage();
      const signature = await signer.signMessage(messageString);

      // Verify
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ message, signature }),
        headers: { "Content-Type": "application/json" },
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "Authentication failed");
      }

      setAddress(walletAddress);
      localStorage.setItem("wallet", walletAddress);
      window.location.href = "/dashboard";
    } catch (err: any) {
      // ✅ PROFESSIONAL ERROR HANDLING

      // Handle the case where user cancels the MetaMask popup
      if (err.code === "ACTION_REJECTED" || err.code === 4001) {
        console.log("User cancelled the login request.");
        // We do nothing here so the user just stays on the login page quietly
        return;
      }

      console.error("Login Error:", err);

      // Only show alert for real system errors, not for user cancellations
      alert(err.message || "An unexpected error occurred during login.");
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
          "w-full rounded-xl bg-indigo-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50",
          loading && "cursor-wait",
        )}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            AUTHENTICATING...
          </span>
        ) : address ? (
          <span className="flex items-center justify-center gap-2">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        ) : (
          "CONNECT WALLET"
        )}
      </button>

      {/* --- PROFESSIONAL INSTALL MODAL --- */}
      {showInstallModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-neutral-900 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <X size={20} strokeWidth={3} />
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Icon Header */}
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>

              <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                Wallet Required
              </h3>
              <p className="mt-2 text-sm font-bold text-slate-500 dark:text-neutral-400">
                To access ChainWarranty, you need a blockchain wallet like
                MetaMask installed in your browser.
              </p>

              {/* Benefits/Info list */}
              <div className="mt-6 w-full space-y-3 text-left">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-neutral-800/50">
                  <ShieldCheck size={18} className="mt-0.5 text-blue-600" />
                  <p className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                    Secure, passwordless login using your private key.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex w-full flex-col gap-3">
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-black text-white transition-all hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-500/20"
                >
                  <Download size={18} strokeWidth={3} />
                  INSTALL METAMASK
                </a>

                <button
                  onClick={() => setShowInstallModal(false)}
                  className="text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase tracking-widest"
                >
                  Maybe Later
                </button>
              </div>

              <div className="mt-6 flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase">
                <ExternalLink size={12} />
                Official MetaMask.io link
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
