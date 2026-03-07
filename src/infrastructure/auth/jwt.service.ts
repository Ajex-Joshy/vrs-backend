import jwt from "jsonwebtoken";
import { env } from "../../config/env.config.js";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
}

export class JwtService {
  generate(payload: AuthTokenPayload): string {
    const expiresIn = env.JWT_EXPIRES_IN as NonNullable<
      jwt.SignOptions["expiresIn"]
    >;

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn,
    });
  }

  verify(token: string): AuthTokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  }
}
