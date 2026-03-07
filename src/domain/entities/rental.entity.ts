import { RentalStatus } from "../value-objects/rental-status.js";

export class Rental {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _vehicleId: string;
  private readonly _startDate: Date;
  private readonly _endDate: Date;
  private _status: RentalStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    vehicleId: string,
    startDate: Date,
    endDate: Date,
    status: RentalStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    if (startDate >= endDate) {
      throw new Error("End date must be after start date");
    }

    this._id = id;
    this._userId = userId;
    this._vehicleId = vehicleId;
    this._startDate = startDate;
    this._endDate = endDate;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(data: {
    id: string;
    userId: string;
    vehicleId: string;
    startDate: Date;
    endDate: Date;
  }): Rental {
    const now = new Date();

    return new Rental(
      data.id,
      data.userId,
      data.vehicleId,
      data.startDate,
      data.endDate,
      RentalStatus.pending(),
      now,
      now,
    );
  }

  // ---------------- GETTERS ----------------

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get vehicleId(): string {
    return this._vehicleId;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get status(): RentalStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ---------------- DOMAIN METHODS ----------------

  confirm(): void {
    if (!this._status.equals(RentalStatus.pending())) {
      throw new Error("Only pending rentals can be confirmed");
    }

    this._status = RentalStatus.active();
    this._updatedAt = new Date();
  }

  complete(): void {
    if (!this._status.equals(RentalStatus.active())) {
      throw new Error("Only active rentals can be completed");
    }

    this._status = RentalStatus.completed();
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (this._status.equals(RentalStatus.completed())) {
      throw new Error("Completed rentals cannot be cancelled");
    }

    this._status = RentalStatus.cancelled();
    this._updatedAt = new Date();
  }

  // ---------------- DTO ----------------

  toPrimitives() {
    return {
      id: this._id,
      userId: this._userId,
      vehicleId: this._vehicleId,
      startDate: this._startDate,
      endDate: this._endDate,
      status: this._status.getValue(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

export type RentalDTO = ReturnType<typeof Rental.prototype.toPrimitives>;
