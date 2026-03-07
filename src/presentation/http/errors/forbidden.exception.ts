import { AppException } from "../../../shared/errors/app.exception.js";
import { ErrorCodes } from "../../../shared/errors/error-codes.js";

export class ForbiddenException extends AppException {
  constructor() {
    super(ErrorCodes.FORBIDDEN, 403);
  }
}
