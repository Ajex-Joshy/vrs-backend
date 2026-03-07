import type { User } from "../../domain/entities/user.entity.js";
import {
  type IUserRepository,
  type UserQueryOptions,
} from "../../domain/repositories/user.repository.js";
import type { PaginatedResult } from "../../domain/types/pagination.types.js";

export class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  async save(entity: User): Promise<void> {
    this.users.set(entity.id, entity);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.users.has(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();

    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalizedEmail) {
        return user;
      }
    }

    return null;
  }

  async findMany(options: UserQueryOptions): Promise<PaginatedResult<User>> {
    const start = (options.page - 1) * options.limit;
    const end = start + options.limit;

    let data = [...this.users.values()];

    if (options.search) {
      const search = options.search.toLowerCase();
      data = data.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search),
      );
    }

    if (options.gender?.length) {
      const genders = new Set(options.gender.map((gender) => gender.getValue()));
      data = data.filter((user) => genders.has(user.gender.getValue()));
    }

    if (options.status?.length) {
      const statuses = new Set(options.status.map((status) => status.getValue()));
      data = data.filter((user) => statuses.has(user.status.getValue()));
    }

    data.sort((a, b) => {
      const order = options.sortOrder === "asc" ? 1 : -1;

      if (options.sortBy === "createdAt" || options.sortBy === "updatedAt") {
        const left = a[options.sortBy].getTime();
        const right = b[options.sortBy].getTime();
        return (left - right) * order;
      }

      const left = a[options.sortBy].toLowerCase();
      const right = b[options.sortBy].toLowerCase();
      return left.localeCompare(right) * order;
    });

    return {
      data: data.slice(start, end),
      total: data.length,
      page: options.page,
      limit: options.limit,
    };
  }

  async findByIds(ids: string[]): Promise<User[]> {
    return ids
      .map((id) => this.users.get(id))
      .filter((user): user is User => user !== undefined);
  }

  async getTotalUsersCount(): Promise<{ today: number; yesterday: number }> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    let today = 0;
    let yesterday = 0;

    for (const user of this.users.values()) {
      const createdAt = user.createdAt;
      if (createdAt >= todayStart) {
        today += 1;
      } else if (createdAt >= yesterdayStart && createdAt < todayStart) {
        yesterday += 1;
      }
    }

    return { today, yesterday };
  }
}
