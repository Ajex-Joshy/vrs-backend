import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import type { ILogRepository } from "@domain/repositories/log.repository.js";
import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";
import { ErrorMessages } from "@shared/errors/error-messages.js";

export const errorHandlerMiddleware = (
  logRepository?: ILogRepository,
): ErrorRequestHandler => {
  return async (error, request, response, _next) => {
    const statusCode = error instanceof AppException ? error.statusCode : 500;
    const code = error instanceof AppException ? error.code : ErrorCodes.INTERNAL_SERVER_ERROR;
    const message = error instanceof AppException ? error.message : ErrorMessages.INTERNAL_SERVER_ERROR;

    if (!(error instanceof ZodError)) {
      const errorLogPayload = {
        code,
        message: error instanceof Error ? error.message : message,
        path: request.path,
        method: request.method,
        ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
        ...(statusCode >= 500 ? { metadata: { source: "error-handler" } } : {}),
      };

      try {
        await logRepository?.logError({
          ...errorLogPayload,
        });
      } catch (logError) {
        // Logging must never mask the original request error response.
        console.error(
          "Failed to persist error log",
          logError instanceof Error ? logError.message : logError,
        );
      }
    }

    if (error instanceof ZodError) {
      response.status(400).json({
        ok: false,
        code: ErrorCodes.VALIDATION_ERROR,
        message: ErrorMessages.VALIDATION_ERROR,
        details: error.flatten(),
      });
      return;
    }

    response.status(statusCode).json({
      ok: false,
      code,
      message,
    });
  };
};
