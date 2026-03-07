import { CreateRentalDtoSchema } from "@application/dtos/rental/create-rental.dto.js";
import { ReturnVehicleDtoSchema } from "@application/dtos/rental/return-vehicle.dto.js";
import { CancelRentalUseCase } from "@application/usecases/rental/cancel-rental.usecase.js";
import { CreateRentalUseCase } from "@application/usecases/rental/create-rental.usecase.js";
import { ReturnVehicleUseCase } from "@application/usecases/rental/return-vehicle.usecase.js";
import type { JwtService } from "@infrastructure/auth/jwt.service.js";
import { authenticate } from "@presentation/http/middlewares/auth.middleware.js";
import { Router } from "express";
import { z } from "zod";

const rentalIdParamSchema = z.object({
  rentalId: z.string().trim().min(1),
});

export const createRentalRouter = (
  createRentalUseCase: CreateRentalUseCase,
  cancelRentalUseCase: CancelRentalUseCase,
  returnVehicleUseCase: ReturnVehicleUseCase,
  jwtService: JwtService,
) => {
  const router = Router();

  router.post("/", authenticate(jwtService), async (request, response, next) => {
    try {
      const dto = CreateRentalDtoSchema.parse(request.body);
      const result = await createRentalUseCase.execute(dto);
      response.status(201).json({ ok: true, data: result });
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
