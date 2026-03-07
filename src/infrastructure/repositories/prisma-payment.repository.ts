import { Payment } from "@domain/entities/payment.entity.js";
import {
  type IPaymentRepository,
  type PaymentQueryOptions,
} from "@domain/repositories/payment.repository.js";
import type { PaginatedResult } from "@domain/types/pagination.types.js";
import { PaymentStatus } from "@domain/value-objects/payment-status.js";
import { prismaClient } from "@infrastructure/database/prisma/prisma.client.js";

type PrismaPaymentRow = NonNullable<
  Awaited<ReturnType<typeof prismaClient.payment.findUnique>>
>;

const toDomainPayment = (row: PrismaPaymentRow): Payment => {
  return new Payment(
    row.id,
    row.rentalId,
    row.amount,
    row.method,
    PaymentStatus.fromValue(row.status),
    row.createdAt,
    row.updatedAt,
  );
};

export class PrismaPaymentRepository implements IPaymentRepository {
  async save(entity: Payment): Promise<void> {
    const rental = await prismaClient.rental.findUnique({
      where: { id: entity.rentalId },
      select: { userId: true },
    });

    if (!rental) {
      throw new Error("Rental not found for payment persistence");
    }

    await prismaClient.payment.upsert({
      where: { id: entity.id },
      update: {
        rentalId: entity.rentalId,
        userId: rental.userId,
        amount: entity.amount,
        method: entity.method,
        status: entity.status.getValue(),
        updatedAt: entity.updatedAt,
      },
      create: {
        id: entity.id,
        rentalId: entity.rentalId,
        userId: rental.userId,
        amount: entity.amount,
        method: entity.method,
        status: entity.status.getValue(),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Payment | null> {
    const row = await prismaClient.payment.findUnique({ where: { id } });
    return row ? toDomainPayment(row) : null;
  }

  async delete(id: string): Promise<void> {
    await prismaClient.payment.delete({ where: { id } }).catch(() => undefined);
  }

  async exists(id: string): Promise<boolean> {
    const count = await prismaClient.payment.count({ where: { id } });
    return count > 0;
  }

  async findMany(options: PaymentQueryOptions): Promise<PaginatedResult<Payment>> {
    const where = {
      ...(options.rentalId ? { rentalId: options.rentalId } : {}),
      ...(options.userId ? { userId: options.userId } : {}),
    };

    const [rows, total]: [PrismaPaymentRow[], number] = await Promise.all([
      prismaClient.payment.findMany({
        where,
        orderBy: { [options.sortBy]: options.sortOrder },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      prismaClient.payment.count({ where }),
    ]);

    return {
      data: rows.map((row: PrismaPaymentRow) => toDomainPayment(row)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }
}
