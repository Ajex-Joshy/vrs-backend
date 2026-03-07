import type { Vehicle } from "../entities/vehicle.entity.js";
import type { PaginatedResult } from "@domain/types/pagination.types.js";
import type { VehicleStatus } from "../value-objects/vehicle-status.js";
import type { IBaseRepository } from "./base.repository.js";

export const vehicleSortableFields = ["name", "brand", "pricePerDay"] as const;

export type VehicleSortableField = (typeof vehicleSortableFields)[number];

export interface VehicleQueryOptions {
  page: number;
  limit: number;
  search?: string;
  brand?: string;
  status?: VehicleStatus[];
  sortBy: VehicleSortableField;
  sortOrder: "asc" | "desc";
}

export interface IVehicleRepository extends IBaseRepository<Vehicle> {
  findMany(options: VehicleQueryOptions): Promise<PaginatedResult<Vehicle>>;
  findByRegistrationNumber(regNo: string): Promise<Vehicle | null>;
}
