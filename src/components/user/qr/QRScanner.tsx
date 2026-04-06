"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type QRScannerProps = {
  onScan: (data: string) => void;
};

export default function QRScanner({ onScan }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const containerId = "qr-reader"; // Unique ID

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;

    const startScanner = async () => {
      // 1. Wait for the DOM element to exist and have dimensions
      const element = document.getElementById(containerId);
      if (!element) return;

      try {
        scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (isRunningRef.current) {
              onScan(decodedText);
            }
          },
          () => {}, // Success/Failure callback (silent)
        );

        isRunningRef.current = true;
      } catch (err) {
        console.error("Scanner failed to start:", err);
      }
    };

    // 2. Delay the start slightly to ensure React has painted the div
    const timer = setTimeout(() => {
      startScanner();
    }, 300);

    // 3. Robust Cleanup
    return () => {
      clearTimeout(timer);
      isRunningRef.current = false;

      if (scanner && scanner.isScanning) {
        scanner
          .stop()
          .then(() => {
            scanner?.clear();
          })
          .catch((err) => console.warn("Cleanup stop error:", err));
      }
    };
  }, [onScan]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-xl">
      <div id={containerId} className="w-full h-full border-0" />
      {/* CSS to force the video to fill the container and not overflow */}
      <style jsx global>{`
        #${containerId} {
          border: none !important;
        }
        #${containerId} video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: inherit;
        }
        /* Hide the annoying 'request camera' text html5-qrcode adds */
        #${containerId} img {
          display: none !important;
        }
        #${containerId} button {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
