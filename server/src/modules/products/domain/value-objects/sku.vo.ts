import { DomainValidationError } from '../../../common/domain/errors/domain-validation.error';

const SKU_REGEX = /^[A-Z0-9-]+$/;
const SKU_MAX_LENGTH = 80;

export class Sku {
  private constructor(private readonly value: string) {}

  public static create(value: string): Sku {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationError('SKU cannot be empty.');
    }

    if (value.length > SKU_MAX_LENGTH) {
      throw new DomainValidationError(
        `SKU cannot be longer than ${SKU_MAX_LENGTH} characters.`,
      );
    }

    if (!SKU_REGEX.test(value)) {
      throw new DomainValidationError(
        'SKU can contain only uppercase letters, digits and dashes.',
      );
    }

    return new Sku(value);
  }

  public toString(): string {
    return this.value;
  }
}
