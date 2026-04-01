import { prisma } from "@/server/db/prisma";
import { SiweMessage } from "siwe";

export async function POST(req: Request) {
  const body = await req.json();

  const { message, signature } = body;

  try {
    const siwe = new SiweMessage(message);

    const result = await siwe.verify({ signature });

    const wallet = result.data.address;

    // 🔥 Find or create user
    let existingWallet = await prisma.wallet.findUnique({
      where: { address: wallet },
      include: { user: true },
    });

    let userId;

    if (!existingWallet) {
      const user = await prisma.user.create({
        data: {
          wallets: {
            create: { address: wallet },
          },
        },
      });

      userId = user.id;
    } else {
      userId = existingWallet.user.id;
    }

    // 🔥 Set cookie (session)
    return new Response(
      JSON.stringify({
        success: true,
        userId,
        wallet,
      }),
      {
        headers: {
          "Set-Cookie": `user=${userId}; Path=/; HttpOnly`,
        },
      },
    );
  } catch (err) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }
}
