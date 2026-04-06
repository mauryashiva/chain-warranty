import { prisma } from "@/server/db/prisma";
import { SiweMessage } from "siwe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, signature } = body;

    if (!message || !signature) {
      return Response.json(
        { error: "Missing message or signature" },
        { status: 400 },
      );
    }

    const siwe = new SiweMessage(message);
    const result = await siwe.verify({ signature });

    const wallet = result.data.address.toLowerCase();

    // 🔥 Find or create user
    let existingWallet = await prisma.wallet.findUnique({
      where: { address: wallet },
      include: { user: true },
    });

    let userId: string;

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

    // 🔐 Secure cookie (improved)
    const cookie = `user=${userId}; Path=/; HttpOnly; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        wallet,
      }),
      {
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("SIWE Verify Error:", err);

    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }
}
