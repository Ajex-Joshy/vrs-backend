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

  static fromValue(value: "PENDING" | "PAID" | "FAILED" | "REFUNDED"): PaymentStatus {
    switch (value) {
      case "PENDING":
        return PaymentStatus.pending();
      case "PAID":
        return PaymentStatus.paid();
      case "FAILED":
        return PaymentStatus.failed();
      case "REFUNDED":
        return PaymentStatus.refunded();
    }
  }

  getValue(): "PENDING" | "PAID" | "FAILED" | "REFUNDED" {
    return this.value;
  }

  equals(other: PaymentStatus): boolean {
    return this.value === other.value;
  }
}
