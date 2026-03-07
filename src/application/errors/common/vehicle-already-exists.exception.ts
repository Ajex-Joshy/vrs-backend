import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";

export class VehicleAlreadyExistsException extends AppException {
  constructor() {
    super(ErrorCodes.VEHICLE_ALREADY_EXISTS, 409);
  }
}
