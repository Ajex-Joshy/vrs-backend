import type { ReturnVehicleDto } from "@application/dtos/rental/return-vehicle.dto.js";
import { InvalidRentalStateException } from "@application/errors/common/invalid-rental-state.exception.js";
import { ResourceNotFoundException } from "@application/errors/common/resource-not-found.exception.js";
import type { ILogRepository } from "@domain/repositories/log.repository.js";
import type { IRentalRepository } from "@domain/repositories/rental.repository.js";
import type { IVehicleRepository } from "@domain/repositories/vehicle.repository.js";

export class ReturnVehicleUseCase {
  constructor(
    private readonly rentalRepository: IRentalRepository,
    private readonly vehicleRepository: IVehicleRepository,
    private readonly logRepository?: ILogRepository,
  ) {}

  async execute(input: ReturnVehicleDto) {
    const rental = await this.rentalRepository.findById(input.rentalId);

    if (!rental) {
      throw new ResourceNotFoundException("Rental");
    }

    const vehicle = await this.vehicleRepository.findById(rental.vehicleId);

    if (!vehicle) {
      throw new ResourceNotFoundException("Vehicle");
    }

    try {
      rental.complete();
      vehicle.returnVehicle();
    } catch (error) {
      throw new InvalidRentalStateException(
        error instanceof Error ? error.message : "Unable to return vehicle",
      );
    }

    const isLateReturn = input.returnDate > rental.endDate;

    await Promise.all([
      this.rentalRepository.save(rental),
      this.vehicleRepository.save(vehicle),
      this.logRepository?.logRentalEvent({
        rentalId: rental.id,
        userId: rental.userId,
        vehicleId: rental.vehicleId,
        eventType: "VEHICLE_RETURNED",
        metadata: {
          returnDate: input.returnDate.toISOString(),
          expectedEndDate: rental.endDate.toISOString(),
          isLateReturn,
        },
      }),
      ...(isLateReturn
        ? [
            this.logRepository?.logRentalEvent({
              rentalId: rental.id,
              userId: rental.userId,
              vehicleId: rental.vehicleId,
              eventType: "LATE_RETURN",
              metadata: {
                returnDate: input.returnDate.toISOString(),
                expectedEndDate: rental.endDate.toISOString(),
              },
            }),
          ]
        : []),
    ]);

    return rental.toPrimitives();
  }
}
