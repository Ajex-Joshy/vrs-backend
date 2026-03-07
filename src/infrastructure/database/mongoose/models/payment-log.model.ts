import { Schema, model, type InferSchemaType } from "mongoose";

const paymentLogSchema = new Schema(
  {
    paymentId: { type: String, required: true },
    rentalId: { type: String },
    userId: { type: String },
    amount: { type: Number },
    eventType: {
      type: String,
      required: true,
      enum: ["PAYMENT_CREATED", "PAYMENT_PAID", "PAYMENT_FAILED", "PAYMENT_REFUNDED"],
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    collection: "payment_logs",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type PaymentLogDocument = InferSchemaType<typeof paymentLogSchema>;

export const PaymentLogModel = model("PaymentLog", paymentLogSchema);
