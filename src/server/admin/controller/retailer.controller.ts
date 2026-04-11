import { prisma } from "@/server/db/prisma";

export const RetailerController = {
  /**
   * 📜 Get all authorized retailers with counts and brands
   */
  async getAllRetailers() {
    return await prisma.retailer.findMany({
      where: { isDeleted: false },
      include: {
        brands: {
          select: { id: true, name: true },
        },
        _count: {
          select: { serials: true, warranties: true },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  /**
   * 🏗️ Create a new Retailer entry
   * Optimized to handle Many-to-Many brand connections
   */
  async createRetailer(data: any) {
    const generatedSlug = data.name.toLowerCase().trim().replace(/\s+/g, "-");

    // 1. Check for GST or Slug uniqueness
    const existing = await prisma.retailer.findFirst({
      where: {
        OR: [{ gstNumber: data.gstNumber }, { slug: generatedSlug }],
      },
    });

    if (existing) {
      throw new Error(
        "A retailer with this name or GST number already exists.",
      );
    }

    // 2. Map fields to Prisma Schema
    return await prisma.retailer.create({
      data: {
        name: data.name,
        slug: generatedSlug,
        type: data.type || "BOTH",
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        country: data.country || "India",
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
        taxId: data.taxId,
        status: "ACTIVE",

        // ✅ MANY-TO-MANY CONNECTION:
        // This links the retailer to all selected brands at once
        brands:
          data.brandIds && data.brandIds.length > 0
            ? {
                connect: data.brandIds.map((id: string) => ({ id })),
              }
            : undefined,
      },
      include: {
        brands: true, // Returns the connected brands in the response
      },
    });
  },

  /**
   * 🗑️ Soft delete retailer
   */
  async deleteRetailer(id: string) {
    return await prisma.retailer.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};
