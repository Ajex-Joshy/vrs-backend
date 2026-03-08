import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MYSQL_DATABASE_URL: z.string().min(1, "MYSQL_DATABASE_URL is required"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().min(1).default("vehicle_rental_logs"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  RAZORPAY_TEST_API_KEY: z.string().default(""),
  RAZORPAY_TEST_SECRET_KEY: z.string().default(""),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.flatten().fieldErrors;
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(errors)}. ` +
      "Set these values in backend/.env (see .env.example).",
  );
}

export const env = parsedEnv.data;

export type Env = z.infer<typeof envSchema>;
