import { CreateRentalDtoSchema } from "@application/dtos/rental/create-rental.dto.js";
import { RentalQueryDtoSchema } from "@application/dtos/rental/rental-query.dto.js";
import { ReturnVehicleDtoSchema } from "@application/dtos/rental/return-vehicle.dto.js";
import { CancelRentalUseCase } from "@application/usecases/rental/cancel-rental.usecase.js";
import { CreateRentalUseCase } from "@application/usecases/rental/create-rental.usecase.js";
import { ListRentalsUseCase } from "@application/usecases/rental/list-rentals.usecase.js";
import { ReturnVehicleUseCase } from "@application/usecases/rental/return-vehicle.usecase.js";
import type { JwtService } from "@infrastructure/auth/jwt.service.js";
import { ForbiddenException } from "@presentation/http/errors/forbidden.exception.js";
import { authenticate } from "@presentation/http/middlewares/auth.middleware.js";
import type { AuthenticatedRequest } from "@presentation/http/types/authenticated-request.type.js";
import { Router } from "express";
import { z } from "zod";

const rentalIdParamSchema = z.object({
  rentalId: z.string().trim().min(1),
});

export const createRentalRouter = (
  createRentalUseCase: CreateRentalUseCase,
  listRentalsUseCase: ListRentalsUseCase,
  cancelRentalUseCase: CancelRentalUseCase,
  returnVehicleUseCase: ReturnVehicleUseCase,
  jwtService: JwtService,
) => {
  const router = Router();

  router.post("/", authenticate(jwtService), async (request, response, next) => {
    try {
      const dto = CreateRentalDtoSchema.parse(request.body);
      const authUser = (request as AuthenticatedRequest).user;

      if (authUser.role === "USER" && dto.userId !== authUser.userId) {
        throw new ForbiddenException();
      }

      const result = await createRentalUseCase.execute(dto);
      response.status(201).json({ ok: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  router.get("/", authenticate(jwtService), async (request, response, next) => {
    try {
      const authUser = (request as AuthenticatedRequest).user;
      const parsedDto = RentalQueryDtoSchema.parse({
        page: request.query.page ?? 1,
        limit: request.query.limit ?? 10,
        userId:
          authUser.role === "USER" ? authUser.userId : request.query.userId,
        vehicleId: request.query.vehicleId,
        status:
          request.query.status === undefined
            ? undefined
            : Array.isArray(request.query.status)
              ? request.query.status
              : String(request.query.status)
                  .split(",")
                  .map((value) => value.trim())
                  .filter(Boolean),
        sortBy: request.query.sortBy ?? "createdAt",
        sortOrder: request.query.sortOrder ?? "desc",
      });

      const result = await listRentalsUseCase.execute(parsedDto);
      response.status(200).json({ ok: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/:rentalId/cancel",
    authenticate(jwtService),
    async (request, response, next) => {
      try {
        const { rentalId } = rentalIdParamSchema.parse(request.params);
        const result = await cancelRentalUseCase.execute(rentalId);
        response.status(200).json({ ok: true, data: result });
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/:rentalId/return",
    authenticate(jwtService),
    async (request, response, next) => {
      try {
        const dto = ReturnVehicleDtoSchema.parse({
          rentalId: request.params.rentalId,
          returnDate: request.body.returnDate,
        });

        const result = await returnVehicleUseCase.execute(dto);
        response.status(200).json({ ok: true, data: result });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
