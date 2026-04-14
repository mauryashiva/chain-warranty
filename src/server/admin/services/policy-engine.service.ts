import { prisma } from "@/server/db/prisma";

export const PolicyEngine = {
  /**
   * 🎯 The "Policy Resolver"
   * Merges Global Defaults with Product-specific Overrides
   */
  async getEffectivePolicy(productId: string) {
    const [globalConfig, productOverride] = await Promise.all([
      // Use findFirst because we only maintain one global record
      prisma.globalConfig.findFirst({
        where: { id: "system_default" },
      }),
      prisma.warrantyRule.findUnique({
        where: { productId },
        include: { product: { select: { name: true, sku: true } } },
      }),
    ]);

    if (!globalConfig) {
      throw new Error("Critical System Error: Global Configuration not found.");
    }

    // Enterprise Merge Strategy: Specific Override > Global Default
    return {
      // Identity
      productId,
      productName: productOverride?.product.name,
      sku: productOverride?.product.sku,

      // Duration Logic (Months)
      baseWarrantyMonths: productOverride?.defaultPeriod ?? 12,
      extendedWarrantyMonths: productOverride?.extendedPeriod ?? 0,

      // Claim Guardrails
      maxClaimsAllowed: productOverride?.maxClaimsAllowed ?? 3,
      claimCooldownDays: productOverride?.claimCooldownDays ?? 30,

      // Transferability & Security
      isTransferable:
        productOverride?.isTransferable ?? globalConfig.allowTransfer,
      requireOtp: globalConfig.requireOtpForTransfer,
      requireIdProof: globalConfig.requireIdProofForTransfer,

      // Registration Window
      registrationWindowDays: globalConfig.maxDaysToRegister,
      allowPostPurchaseRegistration:
        globalConfig.allowRegistrationAfterPurchase,

      // Metadata
      isUsingOverride: !!productOverride,
      lastUpdated: productOverride?.updatedAt || globalConfig.updatedAt,
    };
  },

  /**
   * 📸 The "Snapshotter"
   * Returns a clean object to be saved directly into the Serial/NFT record
   * This protects the customer if the Admin changes rules later.
   */
  async generateWarrantySnapshot(productId: string) {
    const policy = await this.getEffectivePolicy(productId);

    return {
      capturedWarrantyMonths: policy.baseWarrantyMonths,
      capturedMaxClaims: policy.maxClaimsAllowed,
      capturedIsTransferable: policy.isTransferable,
      policyVersionDate: new Date(),
    };
  },
};
