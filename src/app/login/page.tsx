"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConnectWallet from "@/components/wallet/ConnectWallet";

// Better Visible Blockchain Images
const blockchainImages = [
  "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=2400&q=100",
  "https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&w=2400&q=100",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2400&q=100",
];

export default function LoginPage() {
  const [index, setIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const bgTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % blockchainImages.length);
    }, 1500);

    const cardTimer = setTimeout(() => setShowCard(true), 500);

    return () => {
      clearInterval(bgTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* --- BACKGROUND (FIXED) --- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={blockchainImages[index]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${blockchainImages[index]})` }}
          />
        </AnimatePresence>

        {/* Very Light Overlay (ONLY for text readability) */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

        {/* Soft Gradient (no black dominance) */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20 dark:to-black/30" />
      </div>

      {/* --- LOGIN CARD --- */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 16 }}
            className="relative z-10 w-full max-w-md px-6"
          >
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-10 rounded-4xl shadow-2xl">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="h-20 w-20 bg-linear-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-11 h-11 text-white"
                    fill="currentColor"
                  >
                    <path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45z" />
                  </svg>
                </motion.div>
              </div>

              {/* Heading */}
              <div className="text-center mb-10">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                  Connect Wallet
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Access your decentralized warranty dashboard <br />
                  using{" "}
                  <span className="text-orange-500 font-semibold">
                    MetaMask Wallet
                  </span>
                </p>
              </div>

              {/* Wallet Button */}
              <div className="relative group">
                <div className="absolute -inset-px bg-linear-to-r from-orange-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <ConnectWallet />
                </div>
              </div>

              {/* Trust Info */}
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300 uppercase">
                    Secure Blockchain Connection
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
                  Your wallet stays fully private. <br />
                  We never store private keys.
                </p>
              </div>
            </div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm"
            >
              Don't have a wallet?{" "}
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noreferrer"
                className="text-orange-500 font-semibold"
              >
                Install MetaMask
              </a>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
