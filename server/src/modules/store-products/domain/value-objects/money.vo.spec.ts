import { DomainValidationError } from '../errors/domain-validation.error';
import { Money } from './money.vo';

describe('Money', () => {
  it('normalizes value to two decimal places', () => {
    // given
    const rawAmount = '24.9';

    // when
    const amount = Money.create(rawAmount);

    // then
    expect(amount.toString()).toBe('24.90');
  });

  it('throws for negative value', () => {
    // given
    const createAmount = (): Money => Money.create('-1');

    // when / then
    expect(createAmount).toThrow(DomainValidationError);
  });

  it('throws when precision exceeds scale 2', () => {
    // given
    const createAmount = (): Money => Money.create('12.999');

    // when / then
    expect(createAmount).toThrow(DomainValidationError);
  });
});
