import type { RentalQueryDto } from "@application/dtos/rental/rental-query.dto.js";
import type { IRentalRepository } from "@domain/repositories/rental.repository.js";
import { RentalStatus } from "@domain/value-objects/rental-status.js";

const toRentalStatus = (value: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED") => {
  return RentalStatus.fromValue(value);
};

export class ListRentalsUseCase {
  constructor(private readonly rentalRepository: IRentalRepository) {}

  async execute(input: RentalQueryDto) {
    const result = await this.rentalRepository.findMany({
      page: input.page,
      limit: input.limit,
      sortBy: input.sortBy,
      sortOrder: input.sortOrder,
      ...(input.userId ? { userId: input.userId } : {}),
      ...(input.vehicleId ? { vehicleId: input.vehicleId } : {}),
      ...(input.status?.length ? { status: input.status.map(toRentalStatus) } : {}),
    });

    return {
      ...result,
      data: result.data.map((rental) => rental.toPrimitives()),
    };
  }
}
