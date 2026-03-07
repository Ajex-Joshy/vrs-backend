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

  static fromValue(value: "AVAILABLE" | "RENTED" | "MAINTENANCE"): VehicleStatus {
    switch (value) {
      case "AVAILABLE":
        return VehicleStatus.available();
      case "RENTED":
        return VehicleStatus.rented();
      case "MAINTENANCE":
        return VehicleStatus.maintenance();
    }
  }

  getValue(): "AVAILABLE" | "RENTED" | "MAINTENANCE" {
    return this.value;
  }

  equals(other: VehicleStatus): boolean {
    return this.value === other.value;
  }
}
