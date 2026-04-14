import { prisma } from "@/server/db/prisma";
import { AuditController } from "./audit.controller"; // ✅ Import the Observer

export const ClaimController = {
  /**
   * 📋 FETCH ALL CLAIMS (Admin Dashboard)
   */
  async getAllClaims(filters: any = {}) {
    return await prisma.claim.findMany({
      where: {
        ...(filters.status && { status: filters.status }),
        ...(filters.isFraud !== undefined && { isFraud: filters.isFraud }),
      },
      include: {
        product: { select: { name: true, sku: true } },
        warranty: { select: { id: true } },
        user: { select: { name: true, email: true } },
        _count: { select: { documents: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * 🆕 CREATE NEW CLAIM (Customer Side)
   */
  async createClaim(data: {
    warrantyId: string;
    userId: string;
    subject: string;
    description: string;
    type: "REPAIR" | "REPLACEMENT" | "REFUND";
    evidenceUrls?: string[];
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch Warranty & Rules
      const warranty = await tx.warranty.findUnique({
        where: { id: data.warrantyId },
        include: { product: true },
      });

      if (!warranty) throw new Error("Warranty record not found.");

      // 2. Policy Engine Logic
      const globalConfig = await tx.globalConfig.findUnique({
        where: { singleton: "global" },
      });

      const productOverride = await tx.warrantyRule.findUnique({
        where: { productId: warranty.productId },
      });

      // 3. Validation: Max Claims
      const maxAllowed = productOverride?.maxClaimsAllowed ?? 3;
      const count = await tx.claim.count({
        where: { warrantyId: data.warrantyId, status: { not: "REJECTED" } },
      });

      if (count >= maxAllowed) {
        throw new Error(
          `Policy Exhausted: This unit has reached its limit of ${maxAllowed} claims.`,
        );
      }

      // 4. Basic Fraud Scoring
      const hoursSinceReg =
        (Date.now() - new Date(warranty.createdAt).getTime()) /
        (1000 * 60 * 60);
      const fraudScore = hoursSinceReg < 48 ? 75 : 10;

      // 5. Generate Claim Number
      const claimNumber = `CLM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 6. Create the Claim
      const claim = await tx.claim.create({
        data: {
          claimNumber,
          warrantyId: data.warrantyId,
          productId: warranty.productId,
          userId: data.userId,
          subject: data.subject,
          description: data.description,
          type: data.type,
          fraudScore,
          isFraud: fraudScore > 70,
          status: "PENDING",
          priority: fraudScore > 70 ? "HIGH" : "MEDIUM",
        },
      });

      // 7. Attach Evidence (Documents)
      if (data.evidenceUrls?.length) {
        await tx.claimDocument.createMany({
          data: data.evidenceUrls.map((url) => ({
            claimId: claim.id,
            url,
            name: "Customer Evidence",
            fileType: "IMAGE",
            uploadedBy: data.userId,
          })),
        });
      }

      // 8. Initial Log (Claim History)
      await tx.claimLog.create({
        data: {
          claimId: claim.id,
          status: "PENDING",
          note: "System: Claim submitted and passed baseline policy checks.",
          changedBy: data.userId,
        },
      });

      return claim;
    });
  },

  /**
   * 🔄 UPDATE CLAIM STATUS (Admin Action)
   */
  async updateStatus(
    claimId: string,
    adminId: string,
    status: any,
    note: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      // Fetch current state for Audit "oldValue"
      const previousClaim = await tx.claim.findUnique({
        where: { id: claimId },
      });
      if (!previousClaim) throw new Error("Claim not found");

      const updatedClaim = await tx.claim.update({
        where: { id: claimId },
        data: {
          status,
          assignedTo: adminId,
          assignedAt: new Date(),
        },
      });

      // 1. Internal Claim Log (For customer/claim view)
      await tx.claimLog.create({
        data: {
          claimId,
          status,
          note,
          changedBy: adminId,
        },
      });

      // 2. 🛡️ GLOBAL AUDIT LOG (For Admin Compliance)
      await AuditController.log({
        adminId,
        action: "CLAIM_STATUS_CHANGE",
        entity: "CLAIM",
        entityId: claimId,
        entityName: updatedClaim.claimNumber,
        details: `Status transitioned from ${previousClaim.status} to ${status}. Note: ${note}`,
        oldValue: previousClaim,
        newValue: updatedClaim,
      });

      return updatedClaim;
    });
  },
};
