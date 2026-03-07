import { z } from "zod";

export const CreateVehicleDtoSchema = z.object({
  name: z.string().trim().min(2).max(100),
  brand: z.string().trim().min(2).max(100),
  model: z.string().trim().min(1).max(100),
  registrationNumber: z.string().trim().min(3).max(30),
  pricePerDay: z.number().positive(),
});

export type CreateVehicleDto = z.infer<typeof CreateVehicleDtoSchema>;
