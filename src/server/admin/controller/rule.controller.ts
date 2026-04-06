import { prisma } from "@/server/db/prisma";

export const adminRuleController = {
  async getRules() {
    return await prisma.warrantyRule.findMany({
      orderBy: { type: "asc" },
    });
  },

  async updateRule(req: Request) {
    const body = await req.json();
    const { id, value, isEnabled } = body;

    return await prisma.warrantyRule.update({
      where: { id },
      data: {
        value: value.toString(),
        isEnabled,
      },
    });
  },
};
