import type { NextFunction, Request, Response } from "express";
import type { JwtService } from "@infrastructure/auth/jwt.service.js";
import { ForbiddenException } from "@presentation/http/errors/forbidden.exception.js";
import { UnauthorizedException } from "@presentation/http/errors/unauthorized.exception.js";
import type { AuthenticatedRequest } from "@presentation/http/types/authenticated-request.type.js";

export const authenticate = (jwtService: JwtService) => {
  return (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      next(new UnauthorizedException());
      return;
    }

    const token = authHeader.slice(7);

    try {
      const payload = jwtService.verify(token);
      (request as AuthenticatedRequest).user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      next();
    } catch {
      next(new UnauthorizedException());
    }
  };
};

export const authorize = (...roles: Array<"USER" | "ADMIN">) => {
  return (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void => {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      next(new UnauthorizedException());
      return;
    }

    if (!roles.includes(user.role)) {
      next(new ForbiddenException());
      return;
    }

    next();
  };
};
