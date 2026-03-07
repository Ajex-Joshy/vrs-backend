import { AppException } from "../../../shared/errors/app.exception.js";
import { ErrorCodes } from "../../../shared/errors/error-codes.js";

export class UnauthorizedException extends AppException {
  constructor() {
    super(ErrorCodes.UNAUTHORIZED, 401);
  }
}
