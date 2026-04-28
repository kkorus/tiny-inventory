import { DomainValidationError } from '../errors/domain-validation.error';

const PRODUCT_NAME_MAX_LENGTH = 180;

export class ProductName {
  private constructor(private readonly value: string) {}

  public static create(value: string): ProductName {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new DomainValidationError('Product name cannot be empty.');
    }

    if (normalizedValue.length > PRODUCT_NAME_MAX_LENGTH) {
      throw new DomainValidationError(
        `Product name cannot be longer than ${PRODUCT_NAME_MAX_LENGTH} characters.`,
      );
    }

    return new ProductName(normalizedValue);
  }

  public toString(): string {
    return this.value;
  }
}
