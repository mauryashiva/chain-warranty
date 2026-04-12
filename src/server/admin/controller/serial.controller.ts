import { prisma } from "@/server/db/prisma";
import { SerialStatus } from "@prisma/client";

export const SerialController = {
  /**
   * 📊 Get Serial Stats for the Dashboard Cards
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
        prisma.serial.count({ where: { status: "BLOCKED", isDeleted: false } }),
      ]);

    const formatValue = (val: number) =>
      val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toString();

    return {
      total: formatValue(total),
      registered: formatValue(registered),
      unregistered: formatValue(unregistered),
      flagged: formatValue(flagged),
      blocked: formatValue(blocked),
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
        retailer: { select: { id: true, name: true } }, // Include ID for select matching
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
        warranty: true,
      },
    });

    if (!serial) {
      throw new Error("Serial number not found in authorized registry.");
    }

    return serial;
  },

  /**
   * 🔄 Update existing Serial Record
   * Standardizes logistics and status updates
   */
  async updateSerial(id: string, data: any) {
    const existing = await prisma.serial.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Registry Error: Serial record not found.");
    }

    // Safety: Hardware identity (serialNumber, productId, batchId) is omitted
    // to prevent tampering with physical manufacturing records.
    return await prisma.serial.update({
      where: { id },
      data: {
        retailerId: data.retailerId || null,
        dispatchDate: data.dispatchDate ? new Date(data.dispatchDate) : null,
        // Normalize status to UPPERCASE to match Prisma Enum
        status: data.status
          ? (data.status.toUpperCase() as SerialStatus)
          : undefined,
      },
      include: {
        product: {
          include: { brand: { select: { name: true } } },
        },
        retailer: { select: { name: true } },
      },
    });
  },

  /**
   * 🏗️ Create/Bulk Upload Serials
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

    for (const sn of data.serials) {
      try {
        const cleanSN = sn.trim().toUpperCase();

        const existing = await prisma.serial.findUnique({
          where: { serialNumber: cleanSN },
        });

        if (existing) {
          results.failed++;
          results.duplicates.push(cleanSN);
          continue;
        }

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
            status: "UNREGISTERED",
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
