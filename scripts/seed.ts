import "dotenv/config";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@vrs.local";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@1234";
const userEmail = process.env.SEED_USER_EMAIL ?? "user@vrs.local";
const userPassword = process.env.SEED_USER_PASSWORD ?? "User@1234";

const createPasswordHash = async (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, 10);
};

const run = async () => {
  const [adminHash, userHash] = await Promise.all([
    createPasswordHash(adminPassword),
    createPasswordHash(userPassword),
  ]);

  const now = new Date();

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      firstName: "System",
      lastName: "Admin",
      phone: "+10000000000",
      gender: "PREFER_NOT_TO_SAY",
      status: "ACTIVE",
      isBlocked: false,
      role: "ADMIN",
      passwordHash: adminHash,
      updatedAt: now,
    },
    create: {
      id: randomUUID(),
      firstName: "System",
      lastName: "Admin",
      email: adminEmail,
      phone: "+10000000000",
      gender: "PREFER_NOT_TO_SAY",
      status: "ACTIVE",
      isBlocked: false,
      role: "ADMIN",
      passwordHash: adminHash,
    },
  });

  await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      firstName: "Demo",
      lastName: "User",
      phone: "+10000000001",
      gender: "PREFER_NOT_TO_SAY",
      status: "ACTIVE",
      isBlocked: false,
      role: "USER",
      passwordHash: userHash,
      updatedAt: now,
    },
    create: {
      id: randomUUID(),
      firstName: "Demo",
      lastName: "User",
      email: userEmail,
      phone: "+10000000001",
      gender: "PREFER_NOT_TO_SAY",
      status: "ACTIVE",
      isBlocked: false,
      role: "USER",
      passwordHash: userHash,
    },
  });

  console.log("Seed complete:");
  console.log(`- admin: ${adminEmail}`);
  console.log(`- user: ${userEmail}`);
};

run()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
