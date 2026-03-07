import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";

export class UserBlockedException extends AppException {
  constructor() {
    super(ErrorCodes.USER_BLOCKED, 403);
  }
}
