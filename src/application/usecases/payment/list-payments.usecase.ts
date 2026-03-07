import type { PaymentQueryDto } from "@application/dtos/payment/payment-query.dto.js";
import type { IPaymentRepository } from "@domain/repositories/payment.repository.js";

export class ListPaymentsUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(input: PaymentQueryDto) {
    const result = await this.paymentRepository.findMany({
      page: input.page,
      limit: input.limit,
      sortBy: input.sortBy,
      sortOrder: input.sortOrder,
      ...(input.rentalId ? { rentalId: input.rentalId } : {}),
      ...(input.userId ? { userId: input.userId } : {}),
    });

    return {
      ...result,
      data: result.data.map((payment) => payment.toPrimitives()),
    };
  }
}
