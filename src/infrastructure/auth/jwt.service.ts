import jwt from "jsonwebtoken";

export class JwtService {
  generate(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  }

  verify(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}
