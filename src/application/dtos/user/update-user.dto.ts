import { z } from "zod";

export const UpdateUserDtoSchema = z
  .object({
    firstName: z.string().trim().min(3).max(50).optional(),
    lastName: z.string().trim().min(3).max(50).optional(),
    phone: z.string().trim().min(7).max(20).optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
