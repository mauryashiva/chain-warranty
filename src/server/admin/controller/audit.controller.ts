import { prisma } from "@/server/db/prisma";
import { AuditAction, AuditEntity } from "@prisma/client";

export const AuditController = {
  /**
   * 🛡️ CREATE SYSTEM LOG
   * Call this inside any controller after a successful write operation.
   */
  async log({
    adminId,
    action,
    entity,
    entityId,
    entityName,
    details,
    oldValue = null,
    newValue = null,
    txHash = null,
  }: {
    adminId: string;
    action: AuditAction;
    entity: AuditEntity;
    entityId?: string;
    entityName?: string;
    details: string;
    oldValue?: any;
    newValue?: any;
    txHash?: string | null;
  }) {
    try {
      // 1. Fetch Admin details for denormalized storage
      const admin = await prisma.admin.findUnique({
        where: { id: adminId },
        select: { name: true, email: true },
      });

      if (!admin) throw new Error("Admin context not found for auditing.");

      // 2. Create the Immutable Log
      return await prisma.auditLog.create({
        data: {
          adminId,
          adminName: admin.name,
          adminEmail: admin.email,
          action,
          entity,
          entityId,
          entityName,
          details,
          oldValue: oldValue ? JSON.parse(JSON.stringify(oldValue)) : undefined,
          newValue: newValue ? JSON.parse(JSON.stringify(newValue)) : undefined,
          txHash,
        },
      });
    } catch (error) {
      // We console.error but don't throw, to prevent audit failures
      // from crashing the main application logic.
      console.error("CRITICAL: Audit Log Failed:", error);
    }
  },

  /**
   * 📜 FETCH GLOBAL AUDIT REGISTRY
   */
  async getLogs(filters: any = {}) {
    return await prisma.auditLog.findMany({
      where: {
        ...(filters.action && { action: filters.action }),
        ...(filters.entity && { entity: filters.entity }),
        ...(filters.adminId && { adminId: filters.adminId }),
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Safety limit for dashboard performance
    });
  },

  /**
   * 🔍 FETCH HISTORY FOR SPECIFIC ENTITY (e.g., all changes to SONY brand)
   */
  async getEntityHistory(entity: AuditEntity, entityId: string) {
    return await prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: "desc" },
    });
  },
};
