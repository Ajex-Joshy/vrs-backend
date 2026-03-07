export type RoleType = "USER" | "ADMIN";

export class Role {
  private constructor(private readonly value: RoleType) {}

  static user(): Role {
    return new Role("USER");
  }

  static admin(): Role {
    return new Role("ADMIN");
  }

  getValue(): RoleType {
    return this.value;
  }

  equals(role: Role): boolean {
    return this.value === role.value;
  }
}
