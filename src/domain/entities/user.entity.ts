import { Gender } from "../value-objects/gender.js";
import { Role } from "../value-objects/role.js";
import { UserStatus } from "../value-objects/user-status.js";

export class User {
  constructor(
    private readonly _id: string,
    private _firstName: string,
    private _lastName: string,
    private _email: string,
    private _status: UserStatus,
    private _gender: Gender,
    private _phone: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _isBlocked: boolean,
    private _role: Role,
    private passwordHash: string,
  ) {
    this.validateEmail(_email);
    this.validateName(_firstName, "First name");
    this.validateName(_lastName, "Last name");
  }

  static create(data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: Gender;
    passwordHash: string;
  }): User {
    const now = new Date();

    return new User(
      data.id,
      data.firstName,
      data.lastName,
      data.email,
      UserStatus.active(),
      data.gender,
      data.phone,
      now,
      now,
      false,
      Role.user(),
      data.passwordHash,
    );
  }

  // ---------------- GETTERS ----------------

  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get status(): UserStatus {
    return this._status;
  }

  get phone(): string {
    return this._phone;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isBlocked(): boolean {
    return this._isBlocked;
  }

  get role(): Role {
    return this._role;
  }

  get gender(): Gender {
    return this._gender;
  }

  get passwordHashValue(): string {
    return this.passwordHash;
  }

  // ---------------- DOMAIN METHODS ----------------

  block(): void {
    this._isBlocked = true;
    this._status = UserStatus.blocked();
    this._updatedAt = new Date();
  }

  unblock(): void {
    this._isBlocked = false;
    this._status = UserStatus.active();
    this._updatedAt = new Date();
  }

  updatePhone(phone: string): void {
    this._phone = phone;
    this._updatedAt = new Date();
  }

  makeAdmin(): void {
    this._role = Role.admin();
    this._updatedAt = new Date();
  }

  // ---------------- VALIDATIONS ----------------

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
  }

  private validateName(name: string, fieldName: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }

    if (name.length > 100) {
      throw new Error(`${fieldName} cannot exceed 100 characters`);
    }
  }

  // ---------------- DTO ----------------

  toPrimitives() {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      phone: this._phone,
      gender: this._gender.getValue(),
      status: this._status.getValue(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      isBlocked: this._isBlocked,
    };
  }
}

export type UserDTO = ReturnType<typeof User.prototype.toPrimitives>;
