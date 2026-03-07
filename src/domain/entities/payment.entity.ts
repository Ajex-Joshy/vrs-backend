import { PaymentStatus } from "../value-objects/payment-status.js";

export class Payment {
  private readonly _id: string;
  private readonly _rentalId: string;
  private _amount: number;
  private _method: string;
  private _status: PaymentStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    rentalId: string,
    amount: number,
    method: string,
    status: PaymentStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }

    if (!method) {
      throw new Error("Payment method is required");
    }

    this._id = id;
    this._rentalId = rentalId;
    this._amount = amount;
    this._method = method;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(data: {
    id: string;
    rentalId: string;
    amount: number;
    method: string;
  }): Payment {
    const now = new Date();

    return new Payment(
      data.id,
      data.rentalId,
      data.amount,
      data.method,
      PaymentStatus.pending(),
      now,
      now,
    );
  }

  // -------- GETTERS --------

  get id(): string {
    return this._id;
  }

  get rentalId(): string {
    return this._rentalId;
  }

  get amount(): number {
    return this._amount;
  }

  get method(): string {
    return this._method;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // -------- DOMAIN METHODS --------

  markPaid(): void {
    if (!this._status.equals(PaymentStatus.pending())) {
      throw new Error("Only pending payments can be marked as paid");
    }

    this._status = PaymentStatus.paid();
    this._updatedAt = new Date();
  }

  markFailed(): void {
    if (!this._status.equals(PaymentStatus.pending())) {
      throw new Error("Only pending payments can fail");
    }

    this._status = PaymentStatus.failed();
    this._updatedAt = new Date();
  }

  refund(): void {
    if (!this._status.equals(PaymentStatus.paid())) {
      throw new Error("Only paid payments can be refunded");
    }

    this._status = PaymentStatus.refunded();
    this._updatedAt = new Date();
  }

  // -------- DTO --------

  toPrimitives() {
    return {
      id: this._id,
      rentalId: this._rentalId,
      amount: this._amount,
      method: this._method,
      status: this._status.getValue(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

export type PaymentDTO = ReturnType<typeof Payment.prototype.toPrimitives>;
