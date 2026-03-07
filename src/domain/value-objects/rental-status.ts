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

  static fromValue(value: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED"): RentalStatus {
    switch (value) {
      case "PENDING":
        return RentalStatus.pending();
      case "ACTIVE":
        return RentalStatus.active();
      case "COMPLETED":
        return RentalStatus.completed();
      case "CANCELLED":
        return RentalStatus.cancelled();
    }
  }

  getValue(): "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" {
    return this.value;
  }

  equals(other: RentalStatus): boolean {
    return this.value === other.value;
  }
}
