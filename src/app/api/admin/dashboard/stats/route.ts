import { NextResponse } from "next/server";
import { DashboardController } from "@/server/admin/controller/dashboard.controller";

export async function GET() {
  try {
    const stats = await DashboardController.getSummaryStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("[API Dashboard Stats GET] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to load dashboard metrics",
      },
      { status: 500 },
    );
  }
}
