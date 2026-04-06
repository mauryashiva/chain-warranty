import { prisma } from "@/server/db/prisma";

export const adminAuditController = {
  // 🔥 Fetch logs with advanced filtering (By Admin, Entity, or Action)
  async getLogs(req: Request) {
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");
    const entity = searchParams.get("entity");

    return await prisma.auditLog.findMany({
      where: {
        ...(adminId && { adminId }),
        ...(entity && { entity: { contains: entity, mode: "insensitive" } }),
      },
      include: {
        admin: {
          select: { name: true, wallet: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200, // Limit for performance, consider pagination for 10k+ logs
    });
  },
};
