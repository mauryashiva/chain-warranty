import { prisma } from "@/server/db/prisma";

export const ownershipService = {
  async assignOwnership(warrantyId: string, userId: string) {
    return prisma.warrantyOwnership.create({
      data: {
        warrantyId,
        userId,
        isActive: true,
      },
    });
  },

  async transferOwnership(
    warrantyId: string,
    fromUserId: string,
    toUserId: string,
    txHash: string,
  ) {
    // Deactivate old ownership
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

    // Create new ownership
    const newOwnership = await prisma.warrantyOwnership.create({
      data: {
        warrantyId,
        userId: toUserId,
        isActive: true,
      },
    });

    // Save transfer record
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
