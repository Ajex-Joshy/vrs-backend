import type { Rental } from "../entities/rental.entity.js";
import type { PaginatedResult } from "@domain/types/pagination.types.js";
import type { RentalStatus } from "../value-objects/rental-status.js";
import type { IBaseRepository } from "./base.repository.js";

export const rentalSortableFields = [
  "startDate",
  "endDate",
  "createdAt",
] as const;

export type RentalSortableField = (typeof rentalSortableFields)[number];

export interface RentalQueryOptions {
  page: number;
  limit: number;
  userId?: string;
  vehicleId?: string;
  status?: RentalStatus[];
  sortBy: RentalSortableField;
  sortOrder: "asc" | "desc";
}

export interface IRentalRepository extends IBaseRepository<Rental> {
  findMany(options: RentalQueryOptions): Promise<PaginatedResult<Rental>>;
  findActiveRentalByVehicle(vehicleId: string): Promise<Rental | null>;
}
