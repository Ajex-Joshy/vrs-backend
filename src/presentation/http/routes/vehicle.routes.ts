import { VehicleQueryDtoSchema } from "@application/dtos/vehicle/vehicle-query.dto.js";
import { CreateVehicleDtoSchema } from "@application/dtos/vehicle/create-vehicle.dto.js";
import { UpdateVehicleDtoSchema } from "@application/dtos/vehicle/update-vehicle.dto.js";
import { CreateVehicleUseCase } from "@application/usecases/vehicle/create-vehicle.usecase.js";
import { DeleteVehicleUseCase } from "@application/usecases/vehicle/delete-vehicle.usecase.js";
import { ListVehiclesUseCase } from "@application/usecases/vehicle/list-vehicles.usecase.js";
import { UpdateVehicleUseCase } from "@application/usecases/vehicle/update-vehicle.usecase.js";
import type { JwtService } from "@infrastructure/auth/jwt.service.js";
import { authenticate, authorize } from "@presentation/http/middlewares/auth.middleware.js";
import { Router } from "express";
import { z } from "zod";

const vehicleIdParamSchema = z.object({
  vehicleId: z.string().trim().min(1),
});

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
  updateVehicleUseCase: UpdateVehicleUseCase,
  deleteVehicleUseCase: DeleteVehicleUseCase,
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

  router.get("/", async (request, response, next) => {
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

  router.patch(
    "/:vehicleId",
    authenticate(jwtService),
    authorize("ADMIN"),
    async (request, response, next) => {
      try {
        const { vehicleId } = vehicleIdParamSchema.parse(request.params);
        const parsedDto = UpdateVehicleDtoSchema.parse(request.body);
        const result = await updateVehicleUseCase.execute(vehicleId, parsedDto);
        response.status(200).json({ ok: true, data: result });
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete(
    "/:vehicleId",
    authenticate(jwtService),
    authorize("ADMIN"),
    async (request, response, next) => {
      try {
        const { vehicleId } = vehicleIdParamSchema.parse(request.params);
        await deleteVehicleUseCase.execute(vehicleId);
        response.status(200).json({ ok: true, data: { deleted: true } });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
