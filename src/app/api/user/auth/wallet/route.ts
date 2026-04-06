import { prisma } from "@/server/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const wallet = body?.wallet?.toLowerCase();

    // ✅ Validate input
    if (!wallet) {
      return Response.json({ error: "Wallet required" }, { status: 400 });
    }

    // 🔍 Check if wallet exists
    let existingWallet = await prisma.wallet.findUnique({
      where: { address: wallet },
      include: { user: true },
    });

    // 🆕 Create user if not exists
    if (!existingWallet) {
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

    // ✅ Existing user
    return Response.json({
      userId: existingWallet.user.id,
      wallet,
      isNew: false,
    });
  } catch (error) {
    console.error("Wallet Auth Error:", error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
