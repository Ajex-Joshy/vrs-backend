import { AppException } from "../../../shared/errors/app.exception.js";
import { ErrorCodes } from "../../../shared/errors/error-codes.js";

export class InvalidRentalStateException extends AppException {
  constructor(message = "Rental state transition is invalid") {
    super(ErrorCodes.INVALID_RENTAL_STATE, 400, message);
  }
}
