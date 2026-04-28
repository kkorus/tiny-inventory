import { DomainValidationError } from './errors/domain-validation.error';
import { LowStockThreshold } from './value-objects/low-stock-threshold.vo';
import { Money } from './value-objects/money.vo';
import { Quantity } from './value-objects/quantity.vo';
import { StoreProduct } from './store-product.aggregate';

describe('StoreProduct', () => {
  it('marks inventory line as low stock when quantity is below threshold', () => {
    // given
    const storeProduct = StoreProduct.create({
      id: '8e29fcb5-a640-4bc8-bec1-c66a8bc4062f',
      storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
      productId: '06459f12-d156-4410-8e85-28d7f4b6628b',
      price: Money.create('10.00'),
      quantity: Quantity.create(2),
      lowStockThreshold: LowStockThreshold.create(5),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    // when
    const result = storeProduct.isLowStock();

    // then
    expect(result).toBe(true);
  });

  it('throws when decreasing stock below zero', () => {
    // given
    const storeProduct = StoreProduct.create({
      id: '8e29fcb5-a640-4bc8-bec1-c66a8bc4062f',
      storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
      productId: '06459f12-d156-4410-8e85-28d7f4b6628b',
      price: Money.create('10.00'),
      quantity: Quantity.create(2),
      lowStockThreshold: LowStockThreshold.create(1),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    // when
    const decrease = (): void =>
      storeProduct.decreaseQuantity(Quantity.create(3));

    // then
    expect(decrease).toThrow(DomainValidationError);
  });
});
