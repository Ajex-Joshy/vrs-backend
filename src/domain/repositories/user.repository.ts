import type { User } from "../entities/user.entity.js";
import type { PaginatedResult } from "../types/pagination.types.js";
import type { Gender } from "../value-objects/gender.js";
import type { UserStatus } from "../value-objects/user-status.js";
import type { IBaseRepository } from "./base.repository.js";

export const userSortableFields = [
  "firstName",
  "lastName",
  "createdAt",
  "updatedAt",
] as const;

export type UserSortableField = (typeof userSortableFields)[number];

export interface UserQueryOptions {
  page: number;
  limit: number;
  search?: string;

  status?: UserStatus[];
  gender?: Gender[];

  sortBy: UserSortableField;
  sortOrder: "asc" | "desc";
}

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;

  findMany(options: UserQueryOptions): Promise<PaginatedResult<User>>;

  findByIds(ids: string[]): Promise<User[]>;

  getTotalUsersCount(): Promise<{
    today: number;
    yesterday: number;
  }>;
}
