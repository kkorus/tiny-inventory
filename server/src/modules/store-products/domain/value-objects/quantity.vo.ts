import { DomainValidationError } from '../errors/domain-validation.error';

const MAX_QUANTITY = 1_000_000;

export class Quantity {
  private constructor(private readonly value: number) {}

  public static create(value: number): Quantity {
    if (!Number.isInteger(value)) {
      throw new DomainValidationError('Quantity must be an integer.');
    }

    if (value < 0 || value > MAX_QUANTITY) {
      throw new DomainValidationError(
        `Quantity must be between 0 and ${MAX_QUANTITY}.`,
      );
    }

    return new Quantity(value);
  }

  public toNumber(): number {
    return this.value;
  }
}
