export class PaymentStatus {
  private readonly value: "PENDING" | "PAID" | "FAILED" | "REFUNDED";

  private constructor(value: "PENDING" | "PAID" | "FAILED" | "REFUNDED") {
    this.value = value;
  }

  static pending(): PaymentStatus {
    return new PaymentStatus("PENDING");
  }

  static paid(): PaymentStatus {
    return new PaymentStatus("PAID");
  }

  static failed(): PaymentStatus {
    return new PaymentStatus("FAILED");
  }

  static refunded(): PaymentStatus {
    return new PaymentStatus("REFUNDED");
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PaymentStatus): boolean {
    return this.value === other.value;
  }
}
