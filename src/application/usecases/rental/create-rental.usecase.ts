import { randomUUID } from "node:crypto";
import type { CreateRentalDto } from "@application/dtos/rental/create-rental.dto.js";
import { ActiveRentalExistsException } from "@application/errors/common/active-rental-exists.exception.js";
import { ResourceNotFoundException } from "@application/errors/common/resource-not-found.exception.js";
import { VehicleNotAvailableException } from "@application/errors/common/vehicle-not-available.exception.js";
import { Rental } from "@domain/entities/rental.entity.js";
import type { ILogRepository } from "@domain/repositories/log.repository.js";
import type { IRentalRepository } from "@domain/repositories/rental.repository.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";
import type { IVehicleRepository } from "@domain/repositories/vehicle.repository.js";

export class CreateRentalUseCase {
  constructor(
    private readonly rentalRepository: IRentalRepository,
    private readonly vehicleRepository: IVehicleRepository,
    private readonly userRepository: IUserRepository,
    private readonly logRepository?: ILogRepository,
  ) {}

  async execute(input: CreateRentalDto): Promise<ReturnType<Rental["toPrimitives"]>> {
    const [user, vehicle, activeRental] = await Promise.all([
      this.userRepository.findById(input.userId),
      this.vehicleRepository.findById(input.vehicleId),
      this.rentalRepository.findActiveRentalByVehicle(input.vehicleId),
    ]);

    if (!user) {
      throw new ResourceNotFoundException("User");
    }

    if (!vehicle) {
      throw new ResourceNotFoundException("Vehicle");
    }

    if (activeRental) {
      throw new ActiveRentalExistsException();
    }

    if (vehicle.status.getValue() !== "AVAILABLE") {
      throw new VehicleNotAvailableException();
    }

    const rental = Rental.create({
      id: randomUUID(),
      userId: input.userId,
      vehicleId: input.vehicleId,
      startDate: input.startDate,
      endDate: input.endDate,
    });

    rental.confirm();
    vehicle.rent();

    await Promise.all([
      this.rentalRepository.save(rental),
      this.vehicleRepository.save(vehicle),
      this.logRepository?.logRentalEvent({
        rentalId: rental.id,
        userId: rental.userId,
        vehicleId: rental.vehicleId,
        eventType: "RENTAL_CREATED",
        metadata: {
          startDate: rental.startDate.toISOString(),
          endDate: rental.endDate.toISOString(),
          status: rental.status.getValue(),
        },
      }),
    ]);

    return rental.toPrimitives();
  }
}
