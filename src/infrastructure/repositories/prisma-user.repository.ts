import { User } from "@domain/entities/user.entity.js";
import {
  type IUserRepository,
  type UserQueryOptions,
} from "@domain/repositories/user.repository.js";
import type { PaginatedResult } from "@domain/types/pagination.types.js";
import { Gender } from "@domain/value-objects/gender.js";
import { Role } from "@domain/value-objects/role.js";
import { UserStatus } from "@domain/value-objects/user-status.js";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client.js";

type PrismaUserRow = NonNullable<
  Awaited<ReturnType<typeof prismaClient.user.findUnique>>
>;

const toDomainUser = (row: PrismaUserRow): User => {
  return new User(
    row.id,
    row.firstName,
    row.lastName,
    row.email,
    UserStatus.fromValue(row.status),
    Gender.fromValue(row.gender),
    row.phone,
    row.createdAt,
    row.updatedAt,
    row.isBlocked,
    Role.fromValue(row.role),
    row.passwordHash,
  );
};

export class PrismaUserRepository implements IUserRepository {
  async save(entity: User): Promise<void> {
    await prismaClient.user.upsert({
      where: { id: entity.id },
      update: {
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email,
        status: entity.status.getValue(),
        gender: entity.gender.getValue(),
        phone: entity.phone,
        updatedAt: entity.updatedAt,
        isBlocked: entity.isBlocked,
        role: entity.role.getValue(),
        passwordHash: entity.passwordHashValue,
      },
      create: {
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email,
        status: entity.status.getValue(),
        gender: entity.gender.getValue(),
        phone: entity.phone,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        isBlocked: entity.isBlocked,
        role: entity.role.getValue(),
        passwordHash: entity.passwordHashValue,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const row = await prismaClient.user.findUnique({ where: { id } });
    return row ? toDomainUser(row) : null;
  }

  async delete(id: string): Promise<void> {
    await prismaClient.user.delete({ where: { id } }).catch(() => undefined);
  }

  async exists(id: string): Promise<boolean> {
    const count = await prismaClient.user.count({ where: { id } });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await prismaClient.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    return row ? toDomainUser(row) : null;
  }

  async findMany(options: UserQueryOptions): Promise<PaginatedResult<User>> {
    const where = {
      ...(options.search
        ? {
            OR: [
              { firstName: { contains: options.search } },
              { lastName: { contains: options.search } },
              { email: { contains: options.search } },
            ],
          }
        : {}),
      ...(options.gender?.length
        ? {
            gender: {
              in: options.gender.map((gender) => gender.getValue()),
            },
          }
        : {}),
      ...(options.status?.length
        ? {
            status: {
              in: options.status.map((status) => status.getValue()),
            },
          }
        : {}),
    };

    const [rows, total]: [PrismaUserRow[], number] = await Promise.all([
      prismaClient.user.findMany({
        where,
        orderBy: { [options.sortBy]: options.sortOrder },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      prismaClient.user.count({ where }),
    ]);

    return {
      data: rows.map((row: PrismaUserRow) => toDomainUser(row)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findByIds(ids: string[]): Promise<User[]> {
    if (!ids.length) return [];

    const rows: PrismaUserRow[] = await prismaClient.user.findMany({
      where: { id: { in: ids } },
    });

    return rows.map((row: PrismaUserRow) => toDomainUser(row));
  }

  async getTotalUsersCount(): Promise<{ today: number; yesterday: number }> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const [today, yesterday] = await Promise.all([
      prismaClient.user.count({ where: { createdAt: { gte: todayStart } } }),
      prismaClient.user.count({
        where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
      }),
    ]);

    return { today, yesterday };
  }
}
