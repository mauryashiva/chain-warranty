"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type QRScannerProps = {
  onScan: (data: string) => void;
};

export default function QRScanner({ onScan }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            onScan(decodedText);

            // ✅ Stop safely after scan
            if (isRunningRef.current && scannerRef.current) {
              await scannerRef.current.stop();
              await scannerRef.current.clear();
              isRunningRef.current = false;
            }
          },
          () => {},
        );

        isRunningRef.current = true;
      } catch (error) {
        console.error("Scanner start failed:", error);
      }
    };

    startScanner();

    return () => {
      const stopScanner = async () => {
        if (scannerRef.current && isRunningRef.current) {
          try {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
          } catch (error) {
            console.log("Scanner already stopped");
          }
          isRunningRef.current = false;
        }
      };

      stopScanner();
    };
  }, [onScan]);

  return (
    <div className="w-full">
      <div
        id="reader"
        className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800"
      />
    </div>
  );
}
