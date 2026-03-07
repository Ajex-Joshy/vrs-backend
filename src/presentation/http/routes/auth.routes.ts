import { Router } from "express";
import { LoginDtoSchema } from "../../../application/dtos/auth/login.dto.js";
import { RegisterDtoSchema } from "../../../application/dtos/auth/register.dto.js";
import type { LoginUseCase } from "../../../application/usecases/auth/login.usecase.js";
import type { RegisterUseCase } from "../../../application/usecases/auth/register.usecase.js";
import type { JwtService } from "../../../infrastructure/auth/jwt.service.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import type { AuthenticatedRequest } from "../types/authenticated-request.type.js";

export const createAuthRouter = (
  registerUseCase: RegisterUseCase,
  loginUseCase: LoginUseCase,
  jwtService: JwtService,
) => {
  const router = Router();

  router.post("/register", async (request, response, next) => {
    try {
      const dto = RegisterDtoSchema.parse(request.body);
      const user = await registerUseCase.execute(dto);
      response.status(201).json({ ok: true, data: user });
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", async (request, response, next) => {
    try {
      const dto = LoginDtoSchema.parse(request.body);
      const token = await loginUseCase.execute(dto);
      response.status(200).json({ ok: true, data: token });
    } catch (error) {
      next(error);
    }
  });

  router.get("/me", authenticate(jwtService), (request, response) => {
    const user = (request as AuthenticatedRequest).user;
    response.status(200).json({ ok: true, data: user });
  });

  router.get(
    "/admin-only",
    authenticate(jwtService),
    authorize("ADMIN"),
    (_request, response) => {
      response.status(200).json({ ok: true, data: { message: "Admin access granted" } });
    },
  );

  return router;
};
