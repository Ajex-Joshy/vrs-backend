import { CreatePaymentDtoSchema } from "@application/dtos/payment/create-payment.dto.js";
import { PaymentQueryDtoSchema } from "@application/dtos/payment/payment-query.dto.js";
import { CreatePaymentUseCase } from "@application/usecases/payment/create-payment.usecase.js";
import { ListPaymentsUseCase } from "@application/usecases/payment/list-payments.usecase.js";
import type { JwtService } from "@infrastructure/auth/jwt.service.js";
import { authenticate } from "@presentation/http/middlewares/auth.middleware.js";
import type { AuthenticatedRequest } from "@presentation/http/types/authenticated-request.type.js";
import { Router } from "express";

export const createPaymentRouter = (
  createPaymentUseCase: CreatePaymentUseCase,
  listPaymentsUseCase: ListPaymentsUseCase,
  jwtService: JwtService,
) => {
  const router = Router();

  router.post("/", authenticate(jwtService), async (request, response, next) => {
    try {
      const authUser = (request as AuthenticatedRequest).user;
      const dto = CreatePaymentDtoSchema.parse(request.body);
      const result = await createPaymentUseCase.execute(dto, authUser);
      response.status(201).json({ ok: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  router.get("/", authenticate(jwtService), async (request, response, next) => {
    try {
      const authUser = (request as AuthenticatedRequest).user;
      const parsedDto = PaymentQueryDtoSchema.parse({
        page: request.query.page ?? 1,
        limit: request.query.limit ?? 10,
        rentalId: request.query.rentalId,
        userId: authUser.role === "USER" ? authUser.userId : request.query.userId,
        sortBy: request.query.sortBy ?? "createdAt",
        sortOrder: request.query.sortOrder ?? "desc",
      });

      const result = await listPaymentsUseCase.execute(parsedDto);
      response.status(200).json({ ok: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
