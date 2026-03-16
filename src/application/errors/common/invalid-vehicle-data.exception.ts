import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";

export class InvalidVehicleDataException extends AppException {
  constructor(message?: string) {
    super(ErrorCodes.VALIDATION_ERROR, 400, message ?? "Invalid vehicle data");
  }
}
