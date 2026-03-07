export class VehicleStatus {
  private readonly value: "AVAILABLE" | "RENTED" | "MAINTENANCE";

  private constructor(value: "AVAILABLE" | "RENTED" | "MAINTENANCE") {
    this.value = value;
  }

  static available(): VehicleStatus {
    return new VehicleStatus("AVAILABLE");
  }

  static rented(): VehicleStatus {
    return new VehicleStatus("RENTED");
  }

  static maintenance(): VehicleStatus {
    return new VehicleStatus("MAINTENANCE");
  }

  getValue(): string {
    return this.value;
  }

  equals(other: VehicleStatus): boolean {
    return this.value === other.value;
  }
}
