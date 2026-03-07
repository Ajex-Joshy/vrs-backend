import { z } from "zod";

export const UpdateVehicleDtoSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    brand: z.string().trim().min(2).max(100).optional(),
    model: z.string().trim().min(1).max(100).optional(),
    pricePerDay: z.number().positive().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type UpdateVehicleDto = z.infer<typeof UpdateVehicleDtoSchema>;
