import { DomainValidationError } from '../../../common/domain/errors/domain-validation.error';

const MONEY_REGEX = /^(?:\d{1,10})(?:\.\d{1,2})?$/;

export class Money {
  private constructor(private readonly amountInCents: bigint) {}

  public static create(rawAmount: string): Money {
    if (!MONEY_REGEX.test(rawAmount)) {
      throw new DomainValidationError(
        'Price must be a non-negative decimal with scale up to 2 and precision up to 12.',
      );
    }

    const [integerPart, decimalPart = ''] = rawAmount.split('.');
    const centsFromIntegerPart = BigInt(integerPart) * 100n;
    const centsFromDecimalPart = BigInt(decimalPart.padEnd(2, '0'));
    const totalCents = centsFromIntegerPart + centsFromDecimalPart;

    return new Money(totalCents);
  }

  public toString(): string {
    if (this.amountInCents < 0n) {
      throw new Error(
        'Invariant violation: Money.amountInCents cannot be negative. Money.create enforces non-negative values.',
      );
    }

    const integerPart = this.amountInCents / 100n;
    const decimalPart = (this.amountInCents % 100n).toString().padStart(2, '0');
    return `${integerPart.toString()}.${decimalPart}`;
  }
}
