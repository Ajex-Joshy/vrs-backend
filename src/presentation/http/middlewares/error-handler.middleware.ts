import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppException } from "../../../shared/errors/app.exception.js";
import { ErrorCodes } from "../../../shared/errors/error-codes.js";
import { ErrorMessages } from "../../../shared/errors/error-messages.js";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      ok: false,
      code: ErrorCodes.VALIDATION_ERROR,
      message: ErrorMessages.VALIDATION_ERROR,
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof AppException) {
    response.status(error.statusCode).json({
      ok: false,
      code: error.code,
      message: error.message,
    });
    return;
  }

  response.status(500).json({
    ok: false,
    code: ErrorCodes.INTERNAL_SERVER_ERROR,
    message: ErrorMessages.INTERNAL_SERVER_ERROR,
  });
};
