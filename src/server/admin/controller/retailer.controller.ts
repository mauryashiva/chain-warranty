import { prisma } from "@/server/db/prisma";
import { RetailerStatus } from "@prisma/client";

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

        brands:
          data.brandIds && data.brandIds.length > 0
            ? {
                connect: data.brandIds.map((id: string) => ({ id })),
              }
            : undefined,
      },
      include: {
        brands: true,
      },
    });
  },

  /**
   * 🔄 Update existing Retailer profile
   * Handles Many-to-Many brand synchronization and status updates
   */
  async updateRetailer(id: string, data: any) {
    // 1. Check if retailer exists
    const existing = await prisma.retailer.findUnique({
      where: { id },
      include: { brands: true },
    });

    if (!existing) {
      throw new Error("Registry Error: Retailer not found.");
    }

    // 2. Execute Update
    // Note: slug, gstNumber, and panNumber are OMITTED to ensure immutability
    return await prisma.retailer.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        country: data.country,
        taxId: data.taxId,
        status: data.status
          ? (data.status.toUpperCase() as RetailerStatus)
          : undefined,

        // 🏷️ Synchronize Many-to-Many Brand relationships
        // 'set' replaces the old brand list with the new one provided
        brands: data.brandIds
          ? {
              set: data.brandIds.map((brandId: string) => ({ id: brandId })),
            }
          : undefined,
      },
      include: {
        brands: {
          select: { id: true, name: true },
        },
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
