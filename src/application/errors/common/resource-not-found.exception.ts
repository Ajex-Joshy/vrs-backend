import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";

export class ResourceNotFoundException extends AppException {
  constructor(resource: string) {
    super(ErrorCodes.RESOURCE_NOT_FOUND, 404, `${resource} not found`);
  }
}
