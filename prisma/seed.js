import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const iqoo = await prisma.company.upsert({
    where: { id: "iqoo-india" },
    update: {},
    create: {
      id: "iqoo-india",
      name: "iQOO",
      website: "https://www.iqoo.com/in",
    },
  });

  await prisma.product.upsert({
    where: { id: "clp_default_prod_id" },
    update: {},
    create: {
      id: "clp_default_prod_id",
      name: "iQOO Z9x 5G",
      category: "Smartphone",
      companyId: iqoo.id,
    },
  });

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
