"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloud } from "@/lib/storage";

export function useRegisterWarranty() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { address } = useAuth();

  const register = async (formData: any) => {
    if (!address)
      throw new Error(
        "Wallet connected address not found. Please connect your wallet.",
      );

    setIsRegistering(true);
    try {
      // ☁️ Step 1: Upload Files to Supabase (Bucket: chain-warranty)
      // Photos go to /assets, PDFs/Docs go to /documents
      const frontUrl = formData.frontPhoto
        ? await uploadToCloud(formData.frontPhoto, address, "assets")
        : null;

      const backUrl = formData.backPhoto
        ? await uploadToCloud(formData.backPhoto, address, "assets")
        : null;

      const invoiceUrl = formData.invoiceDoc
        ? await uploadToCloud(formData.invoiceDoc, address, "documents")
        : null;

      const cardUrl = formData.warrantyCard
        ? await uploadToCloud(formData.warrantyCard, address, "documents")
        : null;

      // 🔗 Step 2: Send full dataset to Backend API
      const res = await fetch("/api/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 🔥 Primary identifiers (Added productId here)
          walletAddress: address,
          productId: formData.productId || "clp_default_prod_id",
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,

          // Product Specs
          productName: formData.productName,
          brand: formData.brand,
          serialNumber: formData.serialNumber,
          imei: formData.imei,
          category: formData.category,
          color: formData.color,
          condition: formData.condition,

          // Purchase Info (Added expiryDate here)
          purchaseDate: formData.purchaseDate,
          expiryDate: formData.expiryDate,
          warrantyPeriod: formData.warrantyPeriod,
          price: formData.price,
          retailer: formData.retailer,
          invoiceNumber: formData.invoiceNumber,
          country: formData.country,

          // Metadata including the new Supabase URLs
          metadata: {
            frontUrl,
            backUrl,
            invoiceUrl,
            cardUrl,
            registeredAt: new Date().toISOString(),
          },
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        // This will now catch "Missing required field" or Blockchain errors
        throw new Error(result.message || "Blockchain Registration Failed");
      }

      return result.data;
    } catch (err: any) {
      console.error("Final Registration Error:", err);
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

  return { register, isRegistering };
}
