import mongoose from "mongoose";
import { env } from "@config/env.config.js";

export const connectMongo = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
  });
};

export const disconnectMongo = async (): Promise<void> => {
  await mongoose.disconnect();
};
