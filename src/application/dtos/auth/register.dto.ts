import { z } from "zod";

export const RegisterDtoSchema = z.object({
  firstName: z.string().trim().min(3).max(50),
  lastName: z.string().trim().min(3).max(50),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(7).max(20),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  password: z.string().min(8).max(128),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
