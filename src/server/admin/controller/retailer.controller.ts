import { prisma } from "@/server/db/prisma";

export const adminRetailerController = {
  // 🔥 Fetch all retailers with total warranties registered through them
  async getAllRetailers() {
    return await prisma.retailer.findMany({
      include: {
        _count: { select: { warranties: true } },
      },
      orderBy: { name: "asc" },
    });
  },

  // 🔥 Add a new Authorized Retailer
  async createRetailer(req: Request) {
    const body = await req.json();

    return await prisma.retailer.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/ /g, "-"),
        website: body.website || null,
        location: body.location || "Global",
        status: "AUTHORIZED", // AUTHORIZED, SUSPENDED, PENDING
      },
    });
  },
};
