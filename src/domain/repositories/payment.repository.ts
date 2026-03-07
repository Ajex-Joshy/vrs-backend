import type { Payment } from "../entities/payment.entity.js";
import type { PaginatedResult } from "../types/pagination.types.js";
import type { IBaseRepository } from "./base.repository.js";

export const paymentSortableFields = ["amount", "createdAt"] as const;

export type PaymentSortableField = (typeof paymentSortableFields)[number];

export interface PaymentQueryOptions {
  page: number;
  limit: number;
  rentalId?: string;
  userId?: string;
  sortBy: PaymentSortableField;
  sortOrder: "asc" | "desc";
}

export interface IPaymentRepository extends IBaseRepository<Payment> {
  findMany(options: PaymentQueryOptions): Promise<PaginatedResult<Payment>>;
}
