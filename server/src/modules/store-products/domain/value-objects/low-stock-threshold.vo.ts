import { DomainValidationError } from '../errors/domain-validation.error';

const MAX_LOW_STOCK_THRESHOLD = 1_000_000;

export class LowStockThreshold {
  private constructor(private readonly value: number) {}

  public static create(value: number): LowStockThreshold {
    if (!Number.isInteger(value)) {
      throw new DomainValidationError(
        'Low stock threshold must be an integer.',
      );
    }

    if (value < 0 || value > MAX_LOW_STOCK_THRESHOLD) {
      throw new DomainValidationError(
        `Low stock threshold must be between 0 and ${MAX_LOW_STOCK_THRESHOLD}.`,
      );
    }

    return new LowStockThreshold(value);
  }

  public toNumber(): number {
    return this.value;
  }
}
