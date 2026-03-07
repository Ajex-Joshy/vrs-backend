import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();

export const connectPrisma = async (): Promise<void> => {
  await prismaClient.$connect();
};

export const disconnectPrisma = async (): Promise<void> => {
  await prismaClient.$disconnect();
};
