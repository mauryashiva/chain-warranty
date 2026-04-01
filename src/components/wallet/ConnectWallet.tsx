"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { cn } from "@/lib/utils";

export default function ConnectWallet() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // ✅ CHECK METAMASK
      if (!(window as any).ethereum) {
        alert("MetaMask is not installed. Please install it first.");
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      // ✅ STEP 1: FIX - Convert to Checksum Address
      // This handles the lowercase vs uppercase issues for SIWE
      if (!ethers.isAddress(accounts[0])) {
        throw new Error("Invalid wallet address detected");
      }
      const walletAddress = ethers.getAddress(accounts[0]);

      const signer = await provider.getSigner();

      // 🔥 Step 2 — Get nonce from Backend
      const nonceRes = await fetch("/api/auth/nonce");
      const { nonce } = await nonceRes.json();

      // 🔥 Step 3 — Create SIWE Message
      const message = new SiweMessage({
        domain: window.location.host,
        address: walletAddress,
        statement: "Sign in to ChainWarranty",
        uri: window.location.origin,
        version: "1",
        chainId: 1, // Mainnet (Change to your specific chain ID if needed)
        nonce,
      });

      const messageString = message.prepareMessage();

      // 🔥 Step 4 — Request Signature from MetaMask
      const signature = await signer.signMessage(messageString);

      // 🔥 Step 5 — Verify Signature on Backend
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({
          message,
          signature,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "Authentication failed");
      }

      // ✅ Success - Update State and Local Storage
      setAddress(walletAddress);
      localStorage.setItem("wallet", walletAddress);

      // ✅ Redirect to Dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Login Error:", err);
      alert(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={cn(
        "w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50",
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
  );
}
