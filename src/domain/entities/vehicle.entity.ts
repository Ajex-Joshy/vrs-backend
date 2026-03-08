import { VehicleStatus } from "../value-objects/vehicle-status.js";

export class Vehicle {
  private readonly _id: string;
  private _name: string;
  private _brand: string;
  private _model: string;
  private _pricePerDay: number;
  private _registrationNumber: string;
  private _status: VehicleStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    brand: string,
    model: string,
    pricePerDay: number,
    registrationNumber: string,
    status: VehicleStatus = VehicleStatus.available(),
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    if (!name) throw new Error("Vehicle name is required");
    if (!brand) throw new Error("Vehicle brand is required");
    if (!model) throw new Error("Vehicle model is required");
    if (pricePerDay <= 0) throw new Error("Price must be greater than 0");
    if (!registrationNumber) throw new Error("Registration number is required");

    this._id = id;
    this._name = name;
    this._brand = brand;
    this._model = model;
    this._pricePerDay = pricePerDay;
    this._registrationNumber = registrationNumber;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // -------- GETTERS --------

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get brand(): string {
    return this._brand;
  }

  get model(): string {
    return this._model;
  }

  get pricePerDay(): number {
    return this._pricePerDay;
  }

  get registrationNumber(): string {
    return this._registrationNumber;
  }

  get status(): VehicleStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // -------- DOMAIN METHODS --------

  rent(): void {
    if (!this._status.equals(VehicleStatus.available())) {
      throw new Error("Vehicle is not available for rent");
    }

    this._status = VehicleStatus.rented();
    this._updatedAt = new Date();
  }

  returnVehicle(): void {
    if (!this._status.equals(VehicleStatus.rented())) {
      throw new Error("Vehicle is not currently rented");
    }

    this._status = VehicleStatus.available();
    this._updatedAt = new Date();
  }

  markMaintenance(): void {
    this._status = VehicleStatus.maintenance();
    this._updatedAt = new Date();
  }

  updatePrice(price: number): void {
    if (price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    this._pricePerDay = price;
    this._updatedAt = new Date();
  }

  updateDetails(data: {
    name?: string;
    brand?: string;
    model?: string;
    pricePerDay?: number;
  }): void {
    if (data.name !== undefined) {
      if (!data.name.trim()) {
        throw new Error("Vehicle name is required");
      }
      this._name = data.name.trim();
    }

    if (data.brand !== undefined) {
      if (!data.brand.trim()) {
        throw new Error("Vehicle brand is required");
      }
      this._brand = data.brand.trim();
    }

    if (data.model !== undefined) {
      if (!data.model.trim()) {
        throw new Error("Vehicle model is required");
      }
      this._model = data.model.trim();
    }

    if (data.pricePerDay !== undefined) {
      this.updatePrice(data.pricePerDay);
      return;
    }

    this._updatedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this._id,
      name: this._name,
      brand: this._brand,
      model: this._model,
      pricePerDay: this._pricePerDay,
      registrationNumber: this._registrationNumber,
      status: this._status.getValue(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

export type VehicleDTO = ReturnType<typeof Vehicle.prototype.toPrimitives>;
