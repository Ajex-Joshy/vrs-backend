import { AppException } from "../../../shared/errors/app.exception.js";
import { ErrorCodes } from "../../../shared/errors/error-codes.js";

export class ActiveRentalExistsException extends AppException {
  constructor() {
    super(ErrorCodes.ACTIVE_RENTAL_EXISTS, 409);
  }
}
