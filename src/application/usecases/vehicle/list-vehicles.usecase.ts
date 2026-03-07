import type { VehicleQueryDto } from "../../dtos/vehicle/vehicle-query.dto.js";
import type { IVehicleRepository } from "../../../domain/repositories/vehicle.repository.js";
import { VehicleStatus } from "../../../domain/value-objects/vehicle-status.js";

const toVehicleStatus = (value: "AVAILABLE" | "RENTED" | "MAINTENANCE") => {
  switch (value) {
    case "AVAILABLE":
      return VehicleStatus.available();
    case "RENTED":
      return VehicleStatus.rented();
    case "MAINTENANCE":
      return VehicleStatus.maintenance();
  }
};

export class ListVehiclesUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(input: VehicleQueryDto) {
    const options = {
      page: input.page,
      limit: input.limit,
      sortBy: input.sortBy,
      sortOrder: input.sortOrder,
      ...(input.search ? { search: input.search } : {}),
      ...(input.brand ? { brand: input.brand } : {}),
      ...(input.status?.length ? { status: input.status.map(toVehicleStatus) } : {}),
    };

    const result = await this.vehicleRepository.findMany(options);

    return {
      ...result,
      data: result.data.map((vehicle) => vehicle.toPrimitives()),
    };
  }
}
