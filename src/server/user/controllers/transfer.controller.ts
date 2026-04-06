import { transferService } from "@/server/user/services/transfer.service";

export async function transferWarranty(req: Request) {
  try {
    const body = await req.json();

    const result = await transferService.transfer({
      warrantyId: body.warrantyId,
      fromWallet: body.fromWallet,
      toWallet: body.toWallet,
    });

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 },
    );
  }
}
