export interface RentalLogInput {
  rentalId: string;
  eventType:
    | "RENTAL_CREATED"
    | "VEHICLE_PICKED_UP"
    | "VEHICLE_RETURNED"
    | "RENTAL_CANCELLED"
    | "LATE_RETURN";
  userId?: string;
  vehicleId?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentLogInput {
  paymentId: string;
  eventType: "PAYMENT_CREATED" | "PAYMENT_PAID" | "PAYMENT_FAILED" | "PAYMENT_REFUNDED";
  rentalId?: string;
  userId?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
}

export interface ErrorLogInput {
  code?: string;
  message: string;
  path?: string;
  method?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

export interface ILogRepository {
  logRentalEvent(input: RentalLogInput): Promise<void>;
  logPaymentEvent(input: PaymentLogInput): Promise<void>;
  logError(input: ErrorLogInput): Promise<void>;
}
