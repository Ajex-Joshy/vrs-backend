import { ErrorCodes, type ErrorCode } from "./error-codes.js";

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCodes.VALIDATION_ERROR]: "Validation failed",
  [ErrorCodes.UNAUTHORIZED]: "Unauthorized",
  [ErrorCodes.FORBIDDEN]: "Forbidden",
  [ErrorCodes.USER_EXISTS]: "User with this email already exists",
  [ErrorCodes.INVALID_CREDENTIALS]: "Invalid credentials",
  [ErrorCodes.USER_BLOCKED]: "User is blocked",
  [ErrorCodes.INTERNAL_SERVER_ERROR]: "Internal server error",
};
