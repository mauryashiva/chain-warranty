import { prisma } from "@/server/db/prisma";

export const BrandController = {
  /**
   * 📜 Get all brands with relational counts
   */
  async getAllBrands() {
    return await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  /**
   * 🏗️ Create a new brand with validation and all premium fields
   */
  async createBrand(data: any) {
    // Accepting 'any' to easily grab all fields from the UI
    // 1. Check for duplicate Name or Slug
    const existing = await prisma.brand.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
      },
    });

    if (existing) {
      throw new Error("A brand with this name or slug already exists.");
    }

    // 2. Create the brand with ALL fields
    return await prisma.brand.create({
      data: {
        name: data.name,
        slug: data.slug.toLowerCase().replace(/\s+/g, "-"),
        country: data.country,
        status: data.status ? data.status.toUpperCase() : "ACTIVE",

        // 🔥 New Premium UI Fields mapped here!
        website: data.website,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        taxId: data.taxId,
        logoUrl: data.logoUrl,
        description: data.description,
      },
    });
  },

  /**
   * 🗑️ Delete a brand (with safety check)
   */
  async deleteBrand(id: string) {
    // Safety check: Don't delete brands that have products attached
    const productCount = await prisma.product.count({
      where: { brandId: id },
    });

    if (productCount > 0) {
      throw new Error(
        `Cannot delete brand. There are ${productCount} products associated with it.`,
      );
    }

    return await prisma.brand.delete({
      where: { id },
    });
  },

  /**
   * 🔄 Update Brand Details
   */
  async updateBrand(
    id: string,
    data: Partial<{
      name: string;
      status: string;
      country: string;
      website: string;
      supportEmail: string;
      supportPhone: string;
      taxId: string;
      logoUrl: string;
      description: string;
    }>,
  ) {
    const updateData = {
      ...data,
      ...(data.status && { status: data.status.toUpperCase() }),
    };

    return await prisma.brand.update({
      where: { id },
      data: updateData as any,
    });
  },
};
