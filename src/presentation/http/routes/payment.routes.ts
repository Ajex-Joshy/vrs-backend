import { CreatePaymentDtoSchema } from "@application/dtos/payment/create-payment.dto.js";
import { CreatePaymentUseCase } from "@application/usecases/payment/create-payment.usecase.js";
import type { JwtService } from "@infrastructure/auth/jwt.service.js";
import { authenticate } from "@presentation/http/middlewares/auth.middleware.js";
import { Router } from "express";

export const createPaymentRouter = (
  createPaymentUseCase: CreatePaymentUseCase,
  jwtService: JwtService,
) => {
  const router = Router();

  router.post("/", authenticate(jwtService), async (request, response, next) => {
    try {
      const dto = CreatePaymentDtoSchema.parse(request.body);
      const result = await createPaymentUseCase.execute(dto);
      response.status(201).json({ ok: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
