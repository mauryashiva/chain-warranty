import { prisma } from "@/server/db/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const wallet = body.wallet;

  if (!wallet) {
    return Response.json({ error: "Wallet required" }, { status: 400 });
  }

  // 🔥 Check if wallet exists
  let existingWallet = await prisma.wallet.findUnique({
    where: { address: wallet },
    include: { user: true },
  });

  if (!existingWallet) {
    // Create new user + wallet
    const user = await prisma.user.create({
      data: {
        wallets: {
          create: {
            address: wallet,
          },
        },
      },
      include: {
        wallets: true,
      },
    });

    return Response.json({
      userId: user.id,
      wallet,
      isNew: true,
    });
  }

  return Response.json({
    userId: existingWallet.user.id,
    wallet,
    isNew: false,
  });
}
