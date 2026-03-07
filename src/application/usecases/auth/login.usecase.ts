import type { LoginDto } from "@application/dtos/auth/login.dto.js";
import { InvalidCredentialsException } from "@application/errors/auth/invalid-credentials.exception.js";
import { UserBlockedException } from "@application/errors/auth/user-blocked.exception.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";
import type { JwtService } from "@infrastructure/auth/jwt.service.js";
import type { PasswordService } from "@infrastructure/auth/password.service.js";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordService.compare(
      input.password,
      user.passwordHashValue,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    if (user.isBlocked) {
      throw new UserBlockedException();
    }

    const accessToken = this.jwtService.generate({
      sub: user.id,
      email: user.email,
      role: user.role.getValue(),
    });

    return { accessToken };
  }
}
