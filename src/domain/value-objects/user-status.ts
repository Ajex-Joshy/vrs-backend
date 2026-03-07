export type UserStatusType = "ACTIVE" | "BLOCKED" | "SUSPENDED";

export class UserStatus {
  private constructor(private readonly value: UserStatusType) {}

  static active(): UserStatus {
    return new UserStatus("ACTIVE");
  }

  static blocked(): UserStatus {
    return new UserStatus("BLOCKED");
  }

  static suspended(): UserStatus {
    return new UserStatus("SUSPENDED");
  }

  getValue(): UserStatusType {
    return this.value;
  }

  equals(status: UserStatus): boolean {
    return this.value === status.value;
  }
}
