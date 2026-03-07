import { Schema, model, type InferSchemaType } from "mongoose";

const rentalLogSchema = new Schema(
  {
    rentalId: { type: String, required: true },
    userId: { type: String },
    vehicleId: { type: String },
    eventType: {
      type: String,
      required: true,
      enum: [
        "RENTAL_CREATED",
        "VEHICLE_PICKED_UP",
        "VEHICLE_RETURNED",
        "RENTAL_CANCELLED",
        "LATE_RETURN",
      ],
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    collection: "rental_logs",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type RentalLogDocument = InferSchemaType<typeof rentalLogSchema>;

export const RentalLogModel = model("RentalLog", rentalLogSchema);
