import { prisma } from "@/server/db/prisma";

export const ownershipService = {
  // 🔥 Assign first owner (after mint)
  async assignOwnership(warrantyId: string, userId: string) {
    return prisma.warrantyOwnership.create({
      data: {
        warrantyId,
        userId,
        isActive: true,
      },
    });
  },

  // 🔥 Transfer ownership (MAIN LOGIC)
  async transferOwnership(
    warrantyId: string,
    fromUserId: string,
    toUserId: string,
    txHash: string,
  ) {
    // 🔒 Safety check — ensure current owner exists
    const currentOwner = await prisma.warrantyOwnership.findFirst({
      where: {
        warrantyId,
        userId: fromUserId,
        isActive: true,
      },
    });

    if (!currentOwner) {
      throw new Error("Transfer failed: Current owner not found");
    }

    // 🔥 Deactivate old ownership
    await prisma.warrantyOwnership.updateMany({
      where: {
        warrantyId,
        userId: fromUserId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // 🔥 Create new ownership
    const newOwnership = await prisma.warrantyOwnership.create({
      data: {
        warrantyId,
        userId: toUserId,
        isActive: true,
      },
    });

    // 🔥 Save transfer history
    await prisma.transfer.create({
      data: {
        warrantyId,
        fromUserId,
        toUserId,
        txHash,
      },
    });

    return newOwnership;
  },
};
