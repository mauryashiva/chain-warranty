import { NextResponse } from "next/server";
import { AuditController } from "@/server/admin/controller/audit.controller";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const entity = searchParams.get("entity");

    const logs = await AuditController.getLogs({
      action: action || undefined,
      entity: entity || undefined,
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
