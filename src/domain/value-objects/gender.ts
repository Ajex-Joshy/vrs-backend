export type GenderType = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export class Gender {
  private constructor(private readonly value: GenderType) {}

  static male(): Gender {
    return new Gender("MALE");
  }

  static female(): Gender {
    return new Gender("FEMALE");
  }

  static other(): Gender {
    return new Gender("OTHER");
  }

  static prefer_not_to_say(): Gender {
    return new Gender("PREFER_NOT_TO_SAY");
  }

  getValue(): GenderType {
    return this.value;
  }

  equals(gender: Gender): boolean {
    return this.value === gender.value;
  }
}
