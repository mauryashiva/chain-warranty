import { prisma } from "@/server/db/prisma";

export const BrandController = {
  /**
   * 📜 Get all brands with relational counts
   * Only fetches brands that are not soft-deleted
   */
  async getAllBrands() {
    return await prisma.brand.findMany({
      where: {
        isDeleted: false, // Ensure we don't show deleted brands
      },
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
    const generatedSlug = data.slug
      ? data.slug.toLowerCase().trim().replace(/\s+/g, "-")
      : data.name.toLowerCase().trim().replace(/\s+/g, "-");

    // 1. Check for duplicate Name or Slug
    const existing = await prisma.brand.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: generatedSlug }],
      },
    });

    if (existing) {
      throw new Error("A brand with this name or slug already exists.");
    }

    // 2. Create the brand with ALL fields
    return await prisma.brand.create({
      data: {
        name: data.name,
        slug: generatedSlug,
        country: data.country,
        // ✅ Normalized Enum casing
        status: data.status ? data.status.toUpperCase() : "ACTIVE",

        website: data.website,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        taxId: data.taxId,
        logoUrl: data.logoUrl,
        description: data.description,
        isDeleted: false,
      },
    });
  },

  /**
   * 🗑️ Delete a brand (with safety check)
   * Note: In many systems, we do a soft-delete (isDeleted: true)
   */
  async deleteBrand(id: string) {
    // 1. Safety check: Don't delete brands that have products attached
    const productCount = await prisma.product.count({
      where: {
        brandId: id,
        isDeleted: false, // Only check for active products
      },
    });

    if (productCount > 0) {
      throw new Error(
        `Cannot delete brand. There are ${productCount} active products associated with it.`,
      );
    }

    // 2. Perform Soft Delete to preserve historical warranty data
    return await prisma.brand.update({
      where: { id },
      data: { isDeleted: true },
    });
  },

  /**
   * 🔄 Update Brand Details
   */
  async updateBrand(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
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
    // Prepare update object with normalization
    const updateData: any = { ...data };

    if (data.status) {
      updateData.status = data.status.toUpperCase();
    }

    if (data.name && !data.slug) {
      // Re-generate slug if name changes but slug wasn't manually provided
      updateData.slug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
    } else if (data.slug) {
      updateData.slug = data.slug.toLowerCase().trim().replace(/\s+/g, "-");
    }

    return await prisma.brand.update({
      where: { id },
      data: updateData,
    });
  },
};
