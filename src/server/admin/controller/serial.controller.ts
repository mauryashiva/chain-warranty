import { prisma } from "@/server/db/prisma";

export const adminSerialController = {
  // 🔥 Fetch serials with filters (Batch, Product, Status)
  async getSerials(req: Request) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    return await prisma.serial.findMany({
      where: status ? { status: status as any } : {},
      include: { product: { include: { brand: true } } },
      orderBy: { mfgDate: "desc" },
      take: 100, // Pagination limit for performance
    });
  },

  // 🔥 Bulk Upload (Industry Standard for Manufacturers)
  async bulkUpload(req: Request) {
    const body = await req.json();
    const { productId, serials, batch, mfgDate, retailerName } = body;

    // Create many records at once
    const count = await prisma.serial.createMany({
      data: serials.map((num: string) => ({
        number: num,
        productId,
        batch,
        mfgDate: new Date(mfgDate),
        retailerName,
        status: "UNREGISTERED",
      })),
      skipDuplicates: true, // Prevent crashing if a serial already exists
    });

    return { uploaded: count.count };
  },
};
