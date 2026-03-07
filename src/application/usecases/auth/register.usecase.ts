import { randomUUID } from "node:crypto";
import type { RegisterDto } from "@application/dtos/auth/register.dto.js";
import { UserExistsException } from "@application/errors/auth/user-exists.exception.js";
import { User } from "@domain/entities/user.entity.js";
import type { IUserRepository } from "@domain/repositories/user.repository.js";
import { Gender } from "@domain/value-objects/gender.js";
import type { PasswordService } from "@infrastructure/auth/password.service.js";

const genderMap = {
  MALE: () => Gender.male(),
  FEMALE: () => Gender.female(),
  OTHER: () => Gender.other(),
  PREFER_NOT_TO_SAY: () => Gender.prefer_not_to_say(),
} as const;

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(input: RegisterDto): Promise<ReturnType<User["toPrimitives"]>> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new UserExistsException();
    }

    const passwordHash = await this.passwordService.hash(input.password);

    const user = User.create({
      id: randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      gender: genderMap[input.gender](),
      passwordHash,
    });

    await this.userRepository.save(user);

    return user.toPrimitives();
  }
}
