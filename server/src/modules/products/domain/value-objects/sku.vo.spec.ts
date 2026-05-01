import { DomainValidationError } from '../../../common/domain/errors/domain-validation.error';
import { Sku } from './sku.vo';

describe('Sku', () => {
  it('creates SKU for valid uppercase alphanumeric code', () => {
    // given
    const rawSku = 'ELEC-MOUSE-001';

    // when
    const sku = Sku.create(rawSku);

    // then
    expect(sku.toString()).toBe('ELEC-MOUSE-001');
  });

  it('throws for lowercase letters', () => {
    // given
    const createSku = (): Sku => Sku.create('elec-mouse-001');

    // when / then
    expect(createSku).toThrow(DomainValidationError);
  });
});
