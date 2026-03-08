import type { UpdateVehicleDto } from "@application/dtos/vehicle/update-vehicle.dto.js";
import { ResourceNotFoundException } from "@application/errors/common/resource-not-found.exception.js";
import type { IVehicleRepository } from "@domain/repositories/vehicle.repository.js";

export class UpdateVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(
    vehicleId: string,
    input: UpdateVehicleDto,
  ) {
    const vehicle = await this.vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new ResourceNotFoundException("Vehicle");
    }

    vehicle.updateDetails({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.brand !== undefined ? { brand: input.brand } : {}),
      ...(input.model !== undefined ? { model: input.model } : {}),
      ...(input.pricePerDay !== undefined ? { pricePerDay: input.pricePerDay } : {}),
    });

    await this.vehicleRepository.save(vehicle);

    return vehicle.toPrimitives();
  }
}
