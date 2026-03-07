import { randomUUID } from "node:crypto";
import type { CreatePaymentDto } from "@application/dtos/payment/create-payment.dto.js";
import { AccessDeniedException } from "@application/errors/common/access-denied.exception.js";
import { ResourceNotFoundException } from "@application/errors/common/resource-not-found.exception.js";
import { Payment } from "@domain/entities/payment.entity.js";
import type { ILogRepository } from "@domain/repositories/log.repository.js";
import type { IPaymentRepository } from "@domain/repositories/payment.repository.js";
import type { IRentalRepository } from "@domain/repositories/rental.repository.js";

export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly rentalRepository: IRentalRepository,
    private readonly logRepository?: ILogRepository,
  ) {}

  async execute(
    input: CreatePaymentDto,
    actor?: { userId: string; role: "USER" | "ADMIN" },
  ): Promise<ReturnType<Payment["toPrimitives"]>> {
    const rental = await this.rentalRepository.findById(input.rentalId);

    if (!rental) {
      throw new ResourceNotFoundException("Rental");
    }

    if (actor?.role === "USER" && rental.userId !== actor.userId) {
      throw new AccessDeniedException("Users can only create payments for their own rentals");
    }

    const payment = Payment.create({
      id: randomUUID(),
      rentalId: input.rentalId,
      amount: input.amount,
      method: input.method,
    });

    await Promise.all([
      this.paymentRepository.save(payment),
      this.logRepository?.logPaymentEvent({
        paymentId: payment.id,
        rentalId: payment.rentalId,
        userId: rental.userId,
        amount: payment.amount,
        eventType: "PAYMENT_CREATED",
        metadata: {
          method: payment.method,
          status: payment.status.getValue(),
        },
      }),
    ]);

    return payment.toPrimitives();
  }
}
