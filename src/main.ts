import express from "express";
import { env } from "./config/env.config.js";

const app = express();

app.use(express.json());

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

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
