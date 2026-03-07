import { rentalSortableFields } from "@domain/repositories/rental.repository.js";
import { z } from "zod";

const rentalStatusSchema = z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]);

export const RentalQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1),
  userId: z.string().trim().min(1).optional(),
  vehicleId: z.string().trim().min(1).optional(),
  status: z.array(rentalStatusSchema).optional(),
  sortBy: z.enum(rentalSortableFields),
  sortOrder: z.enum(["asc", "desc"]),
});

export type RentalQueryDto = z.infer<typeof RentalQueryDtoSchema>;
