import { PrismaClient } from "@prisma/client";
import generateSeedUsers from "./user.seed";
const prisma = new PrismaClient();

const main = async () => {
  console.log("start seeding...");

  const seedUsers = await generateSeedUsers(10);

  await prisma.user.createMany({ data: seedUsers, skipDuplicates: true });

  console.log("Database seeded successfully!");
};

main()
  .catch((err: any) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
