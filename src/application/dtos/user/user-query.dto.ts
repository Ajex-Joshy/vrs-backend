import { userSortableFields } from "@domain/repositories/user.repository.js";
import { z } from "zod";

const userStatusSchema = z.enum(["ACTIVE", "BLOCKED", "SUSPENDED"]);
const genderSchema = z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]);

export const UserQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1),
  search: z.string().trim().min(1).optional(),
  status: z.array(userStatusSchema).optional(),
  gender: z.array(genderSchema).optional(),
  sortBy: z.enum(userSortableFields),
  sortOrder: z.enum(["asc", "desc"]),
});

export type UserQueryDto = z.infer<typeof UserQueryDtoSchema>;
