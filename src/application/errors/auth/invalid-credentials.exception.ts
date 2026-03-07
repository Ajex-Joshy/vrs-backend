import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";

export class InvalidCredentialsException extends AppException {
  constructor() {
    super(ErrorCodes.INVALID_CREDENTIALS, 401);
  }
}
