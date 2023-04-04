import { PrismaClient } from "@prisma/client";
import logger from "./logger.config";

let prisma = new PrismaClient();

export async function prismaConnection() {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      logger.info("[PRISMA] Prisma connection to the database successful!");
      resolve(true);
    } catch (error) {
      logger.error("[PRISMA] Prisma connection failed!");
      reject(false);
    } finally {
      await prisma.$disconnect();
      logger.info("[PRISMA] Prisma disconnected from the database.");
    }
  });
}

export default prisma;
