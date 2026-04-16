"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloud } from "@/lib/storage";
import { createWarranty } from "@/lib/api/user/warranty";

export function useRegisterWarranty() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { address } = useAuth();

  /**
   * 🚀 REGISTER WARRANTY FLOW
   * 1. Check Auth
   * 2. Upload assets to Cloudinary/Supabase
   * 3. Sync with On-Chain Service via API
   */
  const register = async (formData: any, address: string) => {
    // 🛡️ Ensure wallet is connected
    const walletAddress = address || formData.ownerWallet;

    if (!walletAddress) {
      throw new Error(
        "Identity not found. Please connect your MetaMask wallet to secure this warranty on-chain.",
      );
    }

    setIsRegistering(true);

    try {
      // ☁️ Step 1: Immutable Asset Upload
      // Using Promise.all would be faster, but sequential is safer for error tracking
      const frontUrl = formData.frontPhoto
        ? await uploadToCloud(formData.frontPhoto, walletAddress, "assets")
        : null;

      const backUrl = formData.backPhoto
        ? await uploadToCloud(formData.backPhoto, walletAddress, "assets")
        : null;

      const invoiceUrl = formData.invoiceDoc
        ? await uploadToCloud(formData.invoiceDoc, walletAddress, "documents")
        : null;

      const cardUrl = formData.warrantyCard
        ? await uploadToCloud(formData.warrantyCard, walletAddress, "documents")
        : null;

      // 🔗 Step 2: Protocol Registration
      // We pass brandId and productId so the Controller can enrich names
      const result = await createWarranty({
        walletAddress: walletAddress.toLowerCase(),

        // Identifiers for DB Relations
        productId: formData.productId,
        brandId: formData.brandId,

        // User Identity Snapshot
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,

        // Product Snapshot (Frontend can pass these if they exist)
        productName: formData.productName,
        brand: formData.brand,
        serialNumber: formData.serialNumber,
        imei: formData.imei,
        category: formData.category,
        color: formData.color,
        condition: formData.condition,

        // Purchase Registry
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate,
        warrantyPeriod: formData.warrantyPeriod,
        price: formData.price,
        retailer: formData.retailer,
        invoiceNumber: formData.invoiceNumber,
        country: formData.country,

        // Cloud Metadata
        metadata: {
          frontUrl,
          backUrl,
          invoiceUrl,
          cardUrl,
          registeredAt: new Date().toISOString(),
        },
      });

      return result;
    } catch (err: any) {
      console.error("Protocol Registration Failure:", err);
      throw new Error(err.message || "On-chain registration failed.");
    } finally {
      setIsRegistering(false);
    }
  };

  return { register, isRegistering };
}
