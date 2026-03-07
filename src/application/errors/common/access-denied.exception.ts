import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";

export class AccessDeniedException extends AppException {
  constructor(message = "Forbidden") {
    super(ErrorCodes.FORBIDDEN, 403, message);
  }
}
