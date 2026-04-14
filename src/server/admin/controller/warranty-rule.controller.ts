import { prisma } from "@/server/db/prisma";

export const WarrantyRuleController = {
  /**
   * 🌏 FETCH GLOBAL PROTOCOLS
   * Retrieves the system-wide baseline settings.
   */
  async getGlobalConfig() {
    try {
      let config = await prisma.globalConfig.findFirst({
        where: { id: "system_default" },
      });

      // Industry Standard: If no config exists, initialize the default record
      if (!config) {
        config = await prisma.globalConfig.create({
          data: {
            id: "system_default",
            allowRegistrationAfterPurchase: true,
            maxDaysToRegister: 30,
            allowTransfer: true,
            allowTransferWithOpenClaim: false,
            requireOtpForTransfer: true,
            requireIdProofForTransfer: false,
            allowClaimAfterExpiry: false,
            autoExpireNft: true,
          },
        });
      }

      return config;
    } catch (error) {
      console.error("[Controller] Failed to fetch GlobalConfig:", error);
      throw new Error("Baseline Protocol Fetch Failed");
    }
  },

  /**
   * 📦 FETCH PRODUCT OVERRIDES
   * Retrieves all products and includes their specific policy overrides if they exist.
   */
  async getProductOverrides() {
    try {
      const products = await prisma.product.findMany({
        include: {
          warrantyRule: true, // Joins the override data
        },
        orderBy: {
          name: "asc",
        },
      });

      return products;
    } catch (error) {
      console.error("[Controller] Failed to fetch ProductOverrides:", error);
      throw new Error("SKU Policy Fetch Failed");
    }
  },

  /**
   * 📸 GENERATE POLICY SNAPSHOT
   * Call this during Serial Registration to lock the current rules
   * into the customer's warranty record.
   */
  async getEffectivePolicy(productId: string) {
    try {
      const [globalConfig, productRule] = await Promise.all([
        this.getGlobalConfig(),
        prisma.warrantyRule.findUnique({
          where: { productId },
        }),
      ]);

      // Logic Merge: Product Specific > Global Default
      return {
        warrantyMonths: productRule?.defaultPeriod ?? 12,
        extendedMonths: productRule?.extendedPeriod ?? 0,
        maxClaims: productRule?.maxClaimsAllowed ?? 3,
        cooldownDays: productRule?.claimCooldownDays ?? 30,
        transferable: productRule
          ? productRule.isTransferable
          : (globalConfig?.allowTransfer ?? true),
        requireOtp: globalConfig?.requireOtpForTransfer ?? true,
      };
    } catch (error) {
      console.error("[Controller] Policy Resolution Failed:", error);
      return null;
    }
  },

  /**
   * 🛠️ UPSERT SKU OVERRIDE
   * Creates or updates a specific rule for a product SKU.
   */
  async upsertProductRule(productId: string, data: any) {
    try {
      return await prisma.warrantyRule.upsert({
        where: { productId },
        update: {
          ...data,
          updatedAt: new Date(),
        },
        create: {
          productId,
          ...data,
        },
      });
    } catch (error) {
      console.error("[Controller] SKU Policy Upsert Failed:", error);
      throw new Error("Internal Persistence Error");
    }
  },
};
