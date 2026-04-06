import { prisma } from "@/server/db/prisma";

export const adminUserController = {
  // 🔥 Fetch all admins with their activity counts
  async getAllAdmins() {
    return await prisma.admin.findMany({
      include: {
        _count: { select: { auditLogs: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔥 Invite/Whitelist a new Admin Wallet
  async createAdmin(req: Request) {
    const body = await req.json();
    const { wallet, name, email, role } = body;

    return await prisma.admin.create({
      data: {
        wallet: wallet.toLowerCase(),
        name,
        email,
        role, // SUPER_ADMIN, BRAND_MANAGER, CLAIMS_AGENT, RETAILER_MANAGER
        status: "ACTIVE",
      },
    });
  },

  // 🔥 Revoke Access (Safety First)
  async updateStatus(req: Request) {
    const { id, status } = await req.json();
    return await prisma.admin.update({
      where: { id },
      data: { status },
    });
  },
};
