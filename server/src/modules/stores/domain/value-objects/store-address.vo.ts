import { DomainValidationError } from '../errors/domain-validation.error';

const STORE_ADDRESS_MAX_LENGTH = 255;

export class StoreAddress {
  private constructor(private readonly value: string) {}

  public static create(value: string): StoreAddress {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new DomainValidationError('Store address cannot be empty.');
    }

    if (normalizedValue.length > STORE_ADDRESS_MAX_LENGTH) {
      throw new DomainValidationError(
        `Store address cannot be longer than ${STORE_ADDRESS_MAX_LENGTH} characters.`,
      );
    }

    return new StoreAddress(normalizedValue);
  }

  public toString(): string {
    return this.value;
  }
}
