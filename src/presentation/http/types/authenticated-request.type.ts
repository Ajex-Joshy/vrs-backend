import type { Request } from "express";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
