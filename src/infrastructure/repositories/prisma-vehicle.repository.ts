import { Vehicle } from "@domain/entities/vehicle.entity.js";
import {
  type IVehicleRepository,
  type VehicleQueryOptions,
} from "@domain/repositories/vehicle.repository.js";
import type { PaginatedResult } from "@domain/types/pagination.types.js";
import { VehicleStatus } from "@domain/value-objects/vehicle-status.js";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client.js";

type PrismaVehicleRow = NonNullable<
  Awaited<ReturnType<typeof prismaClient.vehicle.findUnique>>
>;

const toDomainVehicle = (row: PrismaVehicleRow): Vehicle => {
  return new Vehicle(
    row.id,
    row.name,
    row.brand,
    row.model,
    row.pricePerDay,
    row.registrationNumber,
    VehicleStatus.fromValue(row.status),
    row.createdAt,
    row.updatedAt,
  );
};

export class PrismaVehicleRepository implements IVehicleRepository {
  async save(entity: Vehicle): Promise<void> {
    await prismaClient.vehicle.upsert({
      where: { id: entity.id },
      update: {
        name: entity.name,
        brand: entity.brand,
        model: entity.model,
        pricePerDay: entity.pricePerDay,
        registrationNumber: entity.registrationNumber,
        status: entity.status.getValue(),
        updatedAt: entity.updatedAt,
      },
      create: {
        id: entity.id,
        name: entity.name,
        brand: entity.brand,
        model: entity.model,
        pricePerDay: entity.pricePerDay,
        registrationNumber: entity.registrationNumber,
        status: entity.status.getValue(),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    const row = await prismaClient.vehicle.findUnique({ where: { id } });
    return row ? toDomainVehicle(row) : null;
  }

  async delete(id: string): Promise<void> {
    await prismaClient.vehicle.delete({ where: { id } }).catch(() => undefined);
  }

  async exists(id: string): Promise<boolean> {
    const count = await prismaClient.vehicle.count({ where: { id } });
    return count > 0;
  }

  async findByRegistrationNumber(regNo: string): Promise<Vehicle | null> {
    const row = await prismaClient.vehicle.findUnique({
      where: { registrationNumber: regNo.trim() },
    });

    return row ? toDomainVehicle(row) : null;
  }

  async findMany(options: VehicleQueryOptions): Promise<PaginatedResult<Vehicle>> {
    const where = {
      ...(options.search
        ? {
            OR: [
              { name: { contains: options.search } },
              { brand: { contains: options.search } },
              { model: { contains: options.search } },
              { registrationNumber: { contains: options.search } },
            ],
          }
        : {}),
      ...(options.brand ? { brand: { contains: options.brand } } : {}),
      ...(options.status?.length
        ? {
            status: {
              in: options.status.map((status) => status.getValue()),
            },
          }
        : {}),
    };

    const [rows, total]: [PrismaVehicleRow[], number] = await Promise.all([
      prismaClient.vehicle.findMany({
        where,
        orderBy: { [options.sortBy]: options.sortOrder },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      prismaClient.vehicle.count({ where }),
    ]);

    return {
      data: rows.map((row: PrismaVehicleRow) => toDomainVehicle(row)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }
}
