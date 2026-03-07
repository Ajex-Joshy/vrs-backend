import { vehicleSortableFields } from "@domain/repositories/vehicle.repository.js";
import { z } from "zod";

const vehicleStatusSchema = z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]);

export const VehicleQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1),
  search: z.string().trim().min(1).optional(),
  brand: z.string().trim().min(1).optional(),
  status: z.array(vehicleStatusSchema).optional(),
  sortBy: z.enum(vehicleSortableFields),
  sortOrder: z.enum(["asc", "desc"]),
});

export type VehicleQueryDto = z.infer<typeof VehicleQueryDtoSchema>;
