import { ErrorCodes, type ErrorCode } from "./error-codes.js";

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCodes.VALIDATION_ERROR]: "Validation failed",
  [ErrorCodes.UNAUTHORIZED]: "Unauthorized",
  [ErrorCodes.FORBIDDEN]: "Forbidden",
  [ErrorCodes.RESOURCE_NOT_FOUND]: "Resource not found",
  [ErrorCodes.USER_EXISTS]: "User with this email already exists",
  [ErrorCodes.INVALID_CREDENTIALS]: "Invalid credentials",
  [ErrorCodes.USER_BLOCKED]: "User is blocked",
  [ErrorCodes.VEHICLE_ALREADY_EXISTS]: "Vehicle with this registration number already exists",
  [ErrorCodes.VEHICLE_NOT_AVAILABLE]: "Vehicle is not available for rental",
  [ErrorCodes.ACTIVE_RENTAL_EXISTS]: "Vehicle already has an active rental",
  [ErrorCodes.INVALID_RENTAL_STATE]: "Rental state transition is invalid",
  [ErrorCodes.INTERNAL_SERVER_ERROR]: "Internal server error",
};
