import express from "express";
import { env } from "./config/env.config.js";
import { LoginUseCase } from "./application/usecases/auth/login.usecase.js";
import { RegisterUseCase } from "./application/usecases/auth/register.usecase.js";
import { JwtService } from "./infrastructure/auth/jwt.service.js";
import { PasswordService } from "./infrastructure/auth/password.service.js";
import { connectMongo, disconnectMongo } from "./infrastructure/database/mongoose/mongoose.client.js";
import {
  connectPrisma,
  disconnectPrisma,
} from "./infrastructure/database/prisma/prisma.client.js";
import { MongooseLogRepository } from "./infrastructure/repositories/mongoose-log.repository.js";
import { PrismaUserRepository } from "./infrastructure/repositories/prisma-user.repository.js";
import { errorHandlerMiddleware } from "./presentation/http/middlewares/error-handler.middleware.js";
import { createAuthRouter } from "./presentation/http/routes/auth.routes.js";

const app = express();
const userRepository = new PrismaUserRepository();
const logRepository = new MongooseLogRepository();

app.use(express.json());
const passwordService = new PasswordService();
const jwtService = new JwtService();
const registerUseCase = new RegisterUseCase(userRepository, passwordService);
const loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);

app.use("/auth", createAuthRouter(registerUseCase, loginUseCase, jwtService));

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
