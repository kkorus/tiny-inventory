import { DomainValidationError } from '../../../common/domain/errors/domain-validation.error';

const STORE_NAME_MAX_LENGTH = 160;

export class StoreName {
  private constructor(private readonly value: string) {}

  public static create(value: string): StoreName {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new DomainValidationError('Store name cannot be empty.');
    }

    if (normalizedValue.length > STORE_NAME_MAX_LENGTH) {
      throw new DomainValidationError(
        `Store name cannot be longer than ${STORE_NAME_MAX_LENGTH} characters.`,
      );
    }

    return new StoreName(normalizedValue);
  }

  public toString(): string {
    return this.value;
  }
}
