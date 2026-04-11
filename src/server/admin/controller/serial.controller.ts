import { prisma } from "@/server/db/prisma";
import { SerialStatus } from "@prisma/client";

export const SerialController = {
  /**
   * 📊 Get Serial Stats for the Dashboard Cards
   * Standardized to match the Uppercase Enums in your schema
   */
  async getSerialStats() {
    const [total, registered, unregistered, flagged, blocked] =
      await Promise.all([
        prisma.serial.count({ where: { isDeleted: false } }),
        prisma.serial.count({
          where: { status: "REGISTERED", isDeleted: false },
        }),
        prisma.serial.count({
          where: { status: "UNREGISTERED", isDeleted: false },
        }),
        prisma.serial.count({ where: { status: "FLAGGED", isDeleted: false } }),
        prisma.serial.count({ where: { status: "BLOCKED", isDeleted: false } }), // 👈 Add this
      ]);

    // Formatting helper for UI (e.g., 9200 -> 9.2k)
    const formatValue = (val: number) =>
      val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toString();

    return {
      total: formatValue(total),
      registered: formatValue(registered),
      unregistered: formatValue(unregistered),
      flagged: formatValue(flagged),
      blocked: formatValue(blocked), // 👈 Return this
    };
  },

  /**
   * 📜 Get Paginated Serials with Relations
   */
  async getAllSerials(limit = 100) {
    return await prisma.serial.findMany({
      where: { isDeleted: false },
      include: {
        product: {
          include: { brand: { select: { name: true } } },
        },
        retailer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  /**
   * 🔍 Validate a single Serial Number
   */
  async validateSerialNumber(serialNumber: string) {
    const serial = await prisma.serial.findUnique({
      where: {
        serialNumber: serialNumber.trim().toUpperCase(),
      },
      include: {
        product: {
          include: { brand: true },
        },
        retailer: true,
        warranty: true, // This works because of the 1:1 relation we fixed
      },
    });

    if (!serial) {
      throw new Error("Serial number not found in authorized registry.");
    }

    return serial;
  },

  /**
   * 🏗️ Create/Bulk Upload Serials
   * Handles uppercase normalization and date conversion
   */
  async createSerials(data: {
    serials: string[];
    productId: string;
    batchId?: string;
    manufactureDate?: string;
    dispatchDate?: string;
    retailerId?: string;
  }) {
    const results = {
      success: 0,
      failed: 0,
      duplicates: [] as string[],
    };

    // Use a loop to handle individual error catching per serial
    for (const sn of data.serials) {
      try {
        const cleanSN = sn.trim().toUpperCase();

        // 1. Check for existing to prevent P2002 Unique constraint errors
        const existing = await prisma.serial.findUnique({
          where: { serialNumber: cleanSN },
        });

        if (existing) {
          results.failed++;
          results.duplicates.push(cleanSN);
          continue;
        }

        // 2. Create the Serial entry
        await prisma.serial.create({
          data: {
            serialNumber: cleanSN,
            batchId: data.batchId,
            productId: data.productId,
            retailerId: data.retailerId || null,
            manufactureDate: data.manufactureDate
              ? new Date(data.manufactureDate)
              : null,
            dispatchDate: data.dispatchDate
              ? new Date(data.dispatchDate)
              : null,
            status: "UNREGISTERED", // Fixed: Must be Uppercase to match Enum
          },
        });

        results.success++;
      } catch (err) {
        console.error(`Error creating serial ${sn}:`, err);
        results.failed++;
      }
    }

    return results;
  },
};
