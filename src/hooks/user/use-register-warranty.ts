"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloud } from "@/lib/storage";
import { createWarranty } from "@/lib/api/user/warranty";

export function useRegisterWarranty() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { address } = useAuth();

  const register = async (formData: any, address: string) => {
    if (!address) {
      throw new Error(
        "Wallet connected address not found. Please connect your wallet.",
      );
    }

    setIsRegistering(true);

    try {
      // ☁️ Step 1: Upload Files
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

      // 🔗 Step 2: API Call (UPDATED)
      const data = await createWarranty({
        walletAddress: address,
        productId: formData.productId || "clp_default_prod_id",

        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,

        productName: formData.productName,
        brand: formData.brand,
        serialNumber: formData.serialNumber,
        imei: formData.imei,
        category: formData.category,
        color: formData.color,
        condition: formData.condition,

        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate,
        warrantyPeriod: formData.warrantyPeriod,
        price: formData.price,
        retailer: formData.retailer,
        invoiceNumber: formData.invoiceNumber,
        country: formData.country,

        metadata: {
          frontUrl,
          backUrl,
          invoiceUrl,
          cardUrl,
          registeredAt: new Date().toISOString(),
        },
      });

      return data;
    } catch (err: any) {
      console.error("Final Registration Error:", err);
      throw err;
    } finally {
      setIsRegistering(false);
    }
  };

  return { register, isRegistering };
}
