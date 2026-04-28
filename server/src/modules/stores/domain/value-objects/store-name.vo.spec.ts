import { DomainValidationError } from '../errors/domain-validation.error';
import { StoreName } from './store-name.vo';

describe('StoreName', () => {
  it('accepts non-empty store name', () => {
    // given
    const rawName = 'Downtown Store';

    // when
    const name = StoreName.create(rawName);

    // then
    expect(name.toString()).toBe('Downtown Store');
  });

  it('throws for empty name', () => {
    // given
    const createName = (): StoreName => StoreName.create('   ');

    // when / then
    expect(createName).toThrow(DomainValidationError);
  });
});
