import { z } from "zod";

export const CreatePaymentDtoSchema = z.object({
  rentalId: z.string().trim().min(1),
  amount: z.number().positive(),
  method: z.string().trim().min(1).max(50),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentDtoSchema>;
