import { InvalidRentalStateException } from "../../errors/common/invalid-rental-state.exception.js";
import { ResourceNotFoundException } from "../../errors/common/resource-not-found.exception.js";
import type { ILogRepository } from "../../../domain/repositories/log.repository.js";
import type { IRentalRepository } from "../../../domain/repositories/rental.repository.js";
import type { IVehicleRepository } from "../../../domain/repositories/vehicle.repository.js";

export class CancelRentalUseCase {
  constructor(
    private readonly rentalRepository: IRentalRepository,
    private readonly vehicleRepository: IVehicleRepository,
    private readonly logRepository?: ILogRepository,
  ) {}

  async execute(rentalId: string) {
    const rental = await this.rentalRepository.findById(rentalId);

    if (!rental) {
      throw new ResourceNotFoundException("Rental");
    }

    const vehicle = await this.vehicleRepository.findById(rental.vehicleId);

    if (!vehicle) {
      throw new ResourceNotFoundException("Vehicle");
    }

    try {
      rental.cancel();

      if (vehicle.status.getValue() === "RENTED") {
        vehicle.returnVehicle();
      }
    } catch (error) {
      throw new InvalidRentalStateException(
        error instanceof Error ? error.message : "Unable to cancel rental",
      );
    }

    await Promise.all([
      this.rentalRepository.save(rental),
      this.vehicleRepository.save(vehicle),
      this.logRepository?.logRentalEvent({
        rentalId: rental.id,
        userId: rental.userId,
        vehicleId: rental.vehicleId,
        eventType: "RENTAL_CANCELLED",
        metadata: { status: rental.status.getValue() },
      }),
    ]);

    return rental.toPrimitives();
  }
}
