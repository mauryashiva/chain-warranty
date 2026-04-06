import { prisma } from "@/server/db/prisma";

export const walletService = {
  async findOrCreateUserByWallet(address: string) {
    // Normalize wallet address
    const walletAddress = address.toLowerCase();

    // Check if wallet exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { address: walletAddress },
      include: { user: true },
    });

    if (existingWallet) {
      return existingWallet.user;
    }

    // Create new user + wallet
    const user = await prisma.user.create({
      data: {
        wallets: {
          create: {
            address: walletAddress,
          },
        },
      },
      include: {
        wallets: true,
      },
    });

    return user;
  },
};
