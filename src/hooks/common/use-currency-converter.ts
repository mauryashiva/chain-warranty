"use client";

import { useState, useEffect } from "react";

export function useCurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/currency");
        const data = await res.json();
        if (data.rates) {
          setRates(data.rates);
        }
      } catch (err) {
        console.error("Failed to fetch currency rates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  /**
   * Converts a given amount from a local currency to USD.
   */
  const convertToUSD = (amount: number, currencyCode: string): number | null => {
    if (!rates || !rates[currencyCode]) return null;
    if (currencyCode === "USD") return amount;

    const rate = rates[currencyCode];
    // amount in local currency / rate per USD = amount in USD
    return amount / rate;
  };

  /**
   * Evaluates if the converted price falls outside the min/max bounds.
   */
  const checkPriceBounds = (
    amount: number, 
    currencyCode: string, 
    minUSD: number, 
    maxUSD: number
  ): "VALID" | "OUT_OF_BOUNDS" | "UNKNOWN" => {
    const usdValue = convertToUSD(amount, currencyCode);
    if (usdValue === null) return "UNKNOWN";

    if (usdValue < minUSD || usdValue > maxUSD) {
      return "OUT_OF_BOUNDS";
    }
    return "VALID";
  };

  return { rates, loading, convertToUSD, checkPriceBounds };
}
