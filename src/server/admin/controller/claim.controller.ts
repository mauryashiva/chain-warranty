import { prisma } from "@/server/db/prisma";

export const adminClaimController = {
  // 🔥 Fetch all claims with product and user details
  async getAllClaims() {
    return await prisma.claim.findMany({
      include: {
        warranty: {
          include: { product: true },
        },
        user: true,
        logs: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔥 Update claim status (Approved/Rejected)
  async updateClaimStatus(req: Request) {
    const body = await req.json();
    const { claimId, status, note, adminId } = body;

    return await prisma.$transaction(
      async (tx: {
        claim: {
          update: (arg0: { where: { id: any }; data: { status: any } }) => any;
        };
        claimLog: {
          create: (arg0: {
            data: { claimId: any; status: any; note: any };
          }) => any;
        };
        auditLog: {
          create: (arg0: {
            data: { adminId: any; action: string; entity: any; details: any };
          }) => any;
        };
      }) => {
        // 1. Update the claim status
        const updatedClaim = await tx.claim.update({
          where: { id: claimId },
          data: { status },
        });

        // 2. Create a log entry for history
        await tx.claimLog.create({
          data: {
            claimId,
            status,
            note,
          },
        });

        // 3. Create an audit log for the admin action
        await tx.auditLog.create({
          data: {
            adminId,
            action: `CLAIM_${status}`,
            entity: claimId,
            details: note,
          },
        });

        return updatedClaim;
      },
    );
  },
};
