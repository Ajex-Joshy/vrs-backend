export class RentalStatus {
  private readonly value: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

  private constructor(value: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED") {
    this.value = value;
  }

  static pending(): RentalStatus {
    return new RentalStatus("PENDING");
  }

  static active(): RentalStatus {
    return new RentalStatus("ACTIVE");
  }

  static completed(): RentalStatus {
    return new RentalStatus("COMPLETED");
  }

  static cancelled(): RentalStatus {
    return new RentalStatus("CANCELLED");
  }

  getValue(): string {
    return this.value;
  }

  equals(other: RentalStatus): boolean {
    return this.value === other.value;
  }
}
