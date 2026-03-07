import { AppException } from "../../../shared/errors/app.exception.js";
import { ErrorCodes } from "../../../shared/errors/error-codes.js";

export class VehicleNotAvailableException extends AppException {
  constructor() {
    super(ErrorCodes.VEHICLE_NOT_AVAILABLE, 409);
  }
}
