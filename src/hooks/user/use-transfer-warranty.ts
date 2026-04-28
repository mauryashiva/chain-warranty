"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { transferWarranty } from "@/lib/api/user/warranty";
import { toast } from "sonner";

export function useTransferWarranty() {
  const [loading, setLoading] = useState(false);
  const { address: currentOwner } = useAuth();
  
  // Wizard State
  const [step, setStep] = useState<number>(1);
  const [selectedWarranty, setSelectedWarranty] = useState<any | null>(null);
  const [recipientWallet, setRecipientWallet] = useState<string>("");
  const [reason, setReason] = useState<string>("SOLD");
  const [customReason, setCustomReason] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");

  const handleNextStep = () => {
    if (step === 1 && !selectedWarranty) {
      toast.error("Please select a warranty to transfer");
      return;
    }
    if (step === 2) {
      if (!recipientWallet) {
        toast.error("Please provide a recipient wallet address");
        return;
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(recipientWallet)) {
        toast.error("Please enter a valid Ethereum wallet address (e.g., 0x...)");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resetState = () => {
    setStep(1);
    setSelectedWarranty(null);
    setRecipientWallet("");
    setReason("SOLD");
    setCustomReason("");
    setOwnerName("");
    setOwnerEmail("");
    setSalePrice("");
    setCurrency("USD");
  };

  const transfer = async () => {
    if (!currentOwner) {
      toast.error("Wallet not connected");
      return null;
    }

    if (!selectedWarranty || !recipientWallet) {
      toast.error("Missing required transfer details");
      return null;
    }

    setLoading(true);

    try {
      const data = await transferWarranty({
        warrantyId: selectedWarranty.id,
        fromWallet: currentOwner,
        toWallet: recipientWallet,
        reason: reason === "OTHER" ? customReason || "Other" : reason || "Transfer",
        ownerName,
        ownerEmail,
        salePrice,
        currency,
      } as any);

      if (data) {
        toast.success("Warranty transferred successfully!");
        setStep(4); // Success step
      } else {
        toast.error("Failed to transfer warranty");
      }

      return data;
    } catch (error: any) {
      console.error("Transfer Warranty Error:", error);
      toast.error(error.message || "Failed to transfer warranty");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    transfer, 
    loading,
    step,
    setStep,
    selectedWarranty,
    setSelectedWarranty,
    recipientWallet,
    setRecipientWallet,
    reason,
    setReason,
    customReason,
    setCustomReason,
    ownerName,
    setOwnerName,
    ownerEmail,
    setOwnerEmail,
    salePrice,
    setSalePrice,
    currency,
    setCurrency,
    handleNextStep,
    handlePrevStep,
    resetState
  };
}
