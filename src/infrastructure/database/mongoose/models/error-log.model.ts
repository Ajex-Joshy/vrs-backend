import { Schema, model, type InferSchemaType } from "mongoose";

const errorLogSchema = new Schema(
  {
    code: { type: String },
    message: { type: String, required: true },
    path: { type: String },
    method: { type: String },
    stack: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    collection: "error_logs",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type ErrorLogDocument = InferSchemaType<typeof errorLogSchema>;

export const ErrorLogModel = model("ErrorLog", errorLogSchema);
