import { ResourceNotFoundException } from "@application/errors/common/resource-not-found.exception.js";
import type { IVehicleRepository } from "@domain/repositories/vehicle.repository.js";

export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(vehicleId: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new ResourceNotFoundException("Vehicle");
    }

    await this.vehicleRepository.delete(vehicleId);
  }
}
