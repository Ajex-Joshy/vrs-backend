import type {
  ErrorLogInput,
  ILogRepository,
  PaymentLogInput,
  RentalLogInput,
} from "@domain/repositories/log.repository.js";
import { ErrorLogModel } from "@infrastructure/database/mongoose/models/error-log.model.js";
import { PaymentLogModel } from "@infrastructure/database/mongoose/models/payment-log.model.js";
import { RentalLogModel } from "@infrastructure/database/mongoose/models/rental-log.model.js";

export class MongooseLogRepository implements ILogRepository {
  async logRentalEvent(input: RentalLogInput): Promise<void> {
    await RentalLogModel.create(input);
  }

  async logPaymentEvent(input: PaymentLogInput): Promise<void> {
    await PaymentLogModel.create(input);
  }

  async logError(input: ErrorLogInput): Promise<void> {
    await ErrorLogModel.create(input);
  }
}
