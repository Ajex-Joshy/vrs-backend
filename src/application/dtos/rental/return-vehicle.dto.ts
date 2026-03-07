import { z } from "zod";

export const ReturnVehicleDtoSchema = z.object({
  rentalId: z.string().trim().min(1),
  returnDate: z.coerce.date(),
});

export type ReturnVehicleDto = z.infer<typeof ReturnVehicleDtoSchema>;
