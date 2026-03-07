import { VehicleQueryDtoSchema } from "@application/dtos/vehicle/vehicle-query.dto.js";
import { CreateVehicleDtoSchema } from "@application/dtos/vehicle/create-vehicle.dto.js";
import { CreateVehicleUseCase } from "@application/usecases/vehicle/create-vehicle.usecase.js";
import { ListVehiclesUseCase } from "@application/usecases/vehicle/list-vehicles.usecase.js";
import type { JwtService } from "@infrastructure/auth/jwt.service.js";
import { authenticate, authorize } from "@presentation/http/middlewares/auth.middleware.js";
import { Router } from "express";

const toArray = (value: unknown): string[] | undefined => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value.flatMap((item) => String(item).split(",")).map((item) => item.trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const createVehicleRouter = (
  createVehicleUseCase: CreateVehicleUseCase,
  listVehiclesUseCase: ListVehiclesUseCase,
  jwtService: JwtService,
) => {
  const router = Router();

  router.post(
    "/",
    authenticate(jwtService),
    authorize("ADMIN"),
    async (request, response, next) => {
      try {
        const parsedDto = CreateVehicleDtoSchema.parse(request.body);
        const result = await createVehicleUseCase.execute(parsedDto);
        response.status(201).json({ ok: true, data: result });
      } catch (error) {
        next(error);
      }
    },
  );

  router.get("/", authenticate(jwtService), async (request, response, next) => {
    try {
      const parsedDto = VehicleQueryDtoSchema.parse({
        page: request.query.page ?? 1,
        limit: request.query.limit ?? 10,
        search: request.query.search,
        brand: request.query.brand,
        status: toArray(request.query.status),
        sortBy: request.query.sortBy ?? "name",
        sortOrder: request.query.sortOrder ?? "asc",
      });

      const result = await listVehiclesUseCase.execute(parsedDto);
      response.status(200).json({ ok: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
