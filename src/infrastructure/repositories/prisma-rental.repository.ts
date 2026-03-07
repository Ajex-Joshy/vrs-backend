import { Rental } from "@domain/entities/rental.entity.js";
import {
  type IRentalRepository,
  type RentalQueryOptions,
} from "@domain/repositories/rental.repository.js";
import type { PaginatedResult } from "@domain/types/pagination.types.js";
import { RentalStatus } from "@domain/value-objects/rental-status.js";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client.js";

type PrismaRentalRow = NonNullable<
  Awaited<ReturnType<typeof prismaClient.rental.findUnique>>
>;

const toDomainRental = (row: PrismaRentalRow): Rental => {
  return new Rental(
    row.id,
    row.userId,
    row.vehicleId,
    row.startDate,
    row.endDate,
    RentalStatus.fromValue(row.status),
    row.createdAt,
    row.updatedAt,
  );
};

export class PrismaRentalRepository implements IRentalRepository {
  async save(entity: Rental): Promise<void> {
    await prismaClient.rental.upsert({
      where: { id: entity.id },
      update: {
        userId: entity.userId,
        vehicleId: entity.vehicleId,
        startDate: entity.startDate,
        endDate: entity.endDate,
        status: entity.status.getValue(),
        updatedAt: entity.updatedAt,
      },
      create: {
        id: entity.id,
        userId: entity.userId,
        vehicleId: entity.vehicleId,
        startDate: entity.startDate,
        endDate: entity.endDate,
        status: entity.status.getValue(),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Rental | null> {
    const row = await prismaClient.rental.findUnique({ where: { id } });
    return row ? toDomainRental(row) : null;
  }

  async delete(id: string): Promise<void> {
    await prismaClient.rental.delete({ where: { id } }).catch(() => undefined);
  }

  async exists(id: string): Promise<boolean> {
    const count = await prismaClient.rental.count({ where: { id } });
    return count > 0;
  }

  async findActiveRentalByVehicle(vehicleId: string): Promise<Rental | null> {
    const row = await prismaClient.rental.findFirst({
      where: {
        vehicleId,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
    });

    return row ? toDomainRental(row) : null;
  }

  async findMany(options: RentalQueryOptions): Promise<PaginatedResult<Rental>> {
    const where = {
      ...(options.userId ? { userId: options.userId } : {}),
      ...(options.vehicleId ? { vehicleId: options.vehicleId } : {}),
      ...(options.status?.length
        ? {
            status: {
              in: options.status.map((status) => status.getValue()),
            },
          }
        : {}),
    };

    const [rows, total]: [PrismaRentalRow[], number] = await Promise.all([
      prismaClient.rental.findMany({
        where,
        orderBy: { [options.sortBy]: options.sortOrder },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      prismaClient.rental.count({ where }),
    ]);

    return {
      data: rows.map((row: PrismaRentalRow) => toDomainRental(row)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }
}
