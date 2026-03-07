import { z } from "zod";

export const CreateRentalDtoSchema = z
  .object({
    userId: z.string().trim().min(1),
    vehicleId: z.string().trim().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export type CreateRentalDto = z.infer<typeof CreateRentalDtoSchema>;
