import { prisma } from "@/server/db/prisma";
import { AuditAction, AuditEntity } from "@prisma/client";

/**
 * 🛡️ UNIVERSAL AUDIT UTILITY
 * Use this inside any Controller to record an event.
 */
export async function recordAudit(
  tx: any,
  data: {
    admin: { id: string; name: string; email: string };
    action: AuditAction;
    entity: AuditEntity;
    entityId?: string;
    entityName?: string;
    details: string;
    oldValue?: any;
    newValue?: any;
  },
) {
  return await tx.auditLog.create({
    data: {
      adminId: data.admin.id,
      adminName: data.admin.name,
      adminEmail: data.admin.email,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      entityName: data.entityName,
      details: data.details,
      oldValue: data.oldValue,
      newValue: data.newValue,
    },
  });
}
