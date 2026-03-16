import express from "express";
import cors from "cors";
import { CreatePaymentUseCase } from "@application/usecases/payment/create-payment.usecase.js";
import { ListPaymentsUseCase } from "@application/usecases/payment/list-payments.usecase.js";
import { CancelRentalUseCase } from "@application/usecases/rental/cancel-rental.usecase.js";
import { CreateRentalUseCase } from "@application/usecases/rental/create-rental.usecase.js";
import { ListRentalsUseCase } from "@application/usecases/rental/list-rentals.usecase.js";
import { ReturnVehicleUseCase } from "@application/usecases/rental/return-vehicle.usecase.js";
import { CreateVehicleUseCase } from "@application/usecases/vehicle/create-vehicle.usecase.js";
import { DeleteVehicleUseCase } from "@application/usecases/vehicle/delete-vehicle.usecase.js";
import { ListVehiclesUseCase } from "@application/usecases/vehicle/list-vehicles.usecase.js";
import { UpdateVehicleUseCase } from "@application/usecases/vehicle/update-vehicle.usecase.js";
import { env } from "@config/env.config.js";
import { LoginUseCase } from "@application/usecases/auth/login.usecase.js";
import { RegisterUseCase } from "@application/usecases/auth/register.usecase.js";
import { JwtService } from "@infrastructure/auth/jwt.service.js";
import { PasswordService } from "@infrastructure/auth/password.service.js";
import {
  connectMongo,
  disconnectMongo,
} from "@infrastructure/database/mongoose/mongoose.client.js";
import {
  connectPrisma,
  disconnectPrisma,
} from "@infrastructure/database/prisma/prisma.client.js";
import { MongooseLogRepository } from "@infrastructure/repositories/mongoose-log.repository.js";
import { PrismaPaymentRepository } from "@infrastructure/repositories/prisma-payment.repository.js";
import { PrismaRentalRepository } from "@infrastructure/repositories/prisma-rental.repository.js";
import { PrismaUserRepository } from "@infrastructure/repositories/prisma-user.repository.js";
import { PrismaVehicleRepository } from "@infrastructure/repositories/prisma-vehicle.repository.js";
import { errorHandlerMiddleware } from "@presentation/http/middlewares/error-handler.middleware.js";
import { createAuthRouter } from "@presentation/http/routes/auth.routes.js";
import { createPaymentRouter } from "@presentation/http/routes/payment.routes.js";
import { createRentalRouter } from "@presentation/http/routes/rental.routes.js";
import { createVehicleRouter } from "@presentation/http/routes/vehicle.routes.js";

const app = express();
const userRepository = new PrismaUserRepository();
const vehicleRepository = new PrismaVehicleRepository();
const rentalRepository = new PrismaRentalRepository();
const paymentRepository = new PrismaPaymentRepository();
const logRepository = new MongooseLogRepository();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isLocalOrigin =
        /^https?:\/\/localhost(?::\d+)?$/.test(origin) ||
        /^https?:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin);

      callback(isLocalOrigin ? null : new Error("Not allowed by CORS"), isLocalOrigin);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
const passwordService = new PasswordService();
const jwtService = new JwtService();
const registerUseCase = new RegisterUseCase(userRepository, passwordService);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordService,
  jwtService,
);
const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
const listVehiclesUseCase = new ListVehiclesUseCase(vehicleRepository);
const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository);
const deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);
const createRentalUseCase = new CreateRentalUseCase(
  rentalRepository,
  vehicleRepository,
  userRepository,
  logRepository,
);
const listRentalsUseCase = new ListRentalsUseCase(rentalRepository);
const cancelRentalUseCase = new CancelRentalUseCase(
  rentalRepository,
  vehicleRepository,
  logRepository,
);
const returnVehicleUseCase = new ReturnVehicleUseCase(
  rentalRepository,
  vehicleRepository,
  logRepository,
);
const createPaymentUseCase = new CreatePaymentUseCase(
  paymentRepository,
  rentalRepository,
  logRepository,
);
const listPaymentsUseCase = new ListPaymentsUseCase(paymentRepository);

app.use("/auth", createAuthRouter(registerUseCase, loginUseCase, jwtService));
app.use(
  "/vehicles",
  createVehicleRouter(
    createVehicleUseCase,
    listVehiclesUseCase,
    updateVehicleUseCase,
    deleteVehicleUseCase,
    jwtService,
  ),
);
app.use(
  "/rentals",
  createRentalRouter(
    createRentalUseCase,
    listRentalsUseCase,
    cancelRentalUseCase,
    returnVehicleUseCase,
    jwtService,
  ),
);
app.use(
  "/payments",
  createPaymentRouter(createPaymentUseCase, listPaymentsUseCase, jwtService),
);

app.get("/health", (_request, response) => {
  response.status(200).json({
    ok: true,
    service: "vehicle-rental-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use((_request, response) => {
  response.status(404).json({ ok: false, error: "Route not found" });
});
app.use(errorHandlerMiddleware(logRepository));

const bootstrap = async () => {
  await connectPrisma();
  await connectMongo();

  const server = app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectMongo();
      await disconnectPrisma();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

bootstrap().catch((error) => {
  console.error("Failed to bootstrap application", error);
  process.exit(1);
});
