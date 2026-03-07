import { paymentSortableFields } from "@domain/repositories/payment.repository.js";
import { z } from "zod";

export const PaymentQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1),
  rentalId: z.string().trim().min(1).optional(),
  userId: z.string().trim().min(1).optional(),
  sortBy: z.enum(paymentSortableFields),
  sortOrder: z.enum(["asc", "desc"]),
});

export type PaymentQueryDto = z.infer<typeof PaymentQueryDtoSchema>;
