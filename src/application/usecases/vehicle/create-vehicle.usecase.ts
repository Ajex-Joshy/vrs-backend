import { randomUUID } from "node:crypto";
import type { CreateVehicleDto } from "../../dtos/vehicle/create-vehicle.dto.js";
import { Vehicle } from "../../../domain/entities/vehicle.entity.js";
import type { IVehicleRepository } from "../../../domain/repositories/vehicle.repository.js";
import { VehicleAlreadyExistsException } from "../../errors/common/vehicle-already-exists.exception.js";

export class CreateVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(input: CreateVehicleDto): Promise<ReturnType<Vehicle["toPrimitives"]>> {
    const existingVehicle = await this.vehicleRepository.findByRegistrationNumber(
      input.registrationNumber,
    );

    if (existingVehicle) {
      throw new VehicleAlreadyExistsException();
    }

    const vehicle = new Vehicle(
      randomUUID(),
      input.name,
      input.brand,
      input.model,
      input.pricePerDay,
      input.registrationNumber,
    );

    await this.vehicleRepository.save(vehicle);

    return vehicle.toPrimitives();
  }
}
