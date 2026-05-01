import { DomainValidationError } from '../../common/domain/errors/domain-validation.error';
import { LowStockThreshold } from './value-objects/low-stock-threshold.vo';
import { Money } from './value-objects/money.vo';
import { Quantity } from './value-objects/quantity.vo';
import { StoreProduct } from './store-product.aggregate';

const BASE_PROPS = {
  id: '8e29fcb5-a640-4bc8-bec1-c66a8bc4062f',
  storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
  productId: '06459f12-d156-4410-8e85-28d7f4b6628b',
  price: Money.create('10.00'),
  quantity: Quantity.create(10),
  lowStockThreshold: LowStockThreshold.create(5),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
} as const;

function buildProduct(
  overrides: Partial<Parameters<typeof StoreProduct.create>[0]> = {},
): StoreProduct {
  return StoreProduct.create({ ...BASE_PROPS, ...overrides });
}

describe('StoreProduct', () => {
  describe('isLowStock', () => {
    it('returns true when quantity is below threshold', () => {
      // given
      const storeProduct = buildProduct({
        quantity: Quantity.create(2),
        lowStockThreshold: LowStockThreshold.create(5),
      });

      // when
      const result = storeProduct.isLowStock();

      // then
      expect(result).toBe(true);
    });

    it('returns false when quantity is above threshold', () => {
      // given
      const storeProduct = buildProduct({
        quantity: Quantity.create(10),
        lowStockThreshold: LowStockThreshold.create(5),
      });

      // when
      const result = storeProduct.isLowStock();

      // then
      expect(result).toBe(false);
    });
  });

  describe('decreaseQuantity', () => {
    it('decreases quantity by given amount', () => {
      // given
      const storeProduct = buildProduct({ quantity: Quantity.create(10) });

      // when
      storeProduct.decreaseQuantity(Quantity.create(3));

      // then
      expect(storeProduct.toSnapshot().quantity).toBe(7);
    });

    it('throws when decreasing stock below zero', () => {
      // given
      const storeProduct = buildProduct({ quantity: Quantity.create(2) });

      // when
      const decrease = (): void =>
        storeProduct.decreaseQuantity(Quantity.create(3));

      // then
      expect(decrease).toThrow(DomainValidationError);
    });
  });

  describe('increaseQuantity', () => {
    it('increases quantity by given amount', () => {
      // given
      const storeProduct = buildProduct({ quantity: Quantity.create(10) });

      // when
      storeProduct.increaseQuantity(Quantity.create(5));

      // then
      expect(storeProduct.toSnapshot().quantity).toBe(15);
    });

    it('throws when resulting quantity exceeds maximum', () => {
      // given
      const storeProduct = buildProduct({ quantity: Quantity.create(999_999) });

      // when
      const increase = (): void =>
        storeProduct.increaseQuantity(Quantity.create(2));

      // then
      expect(increase).toThrow(DomainValidationError);
    });
  });

  describe('changePrice', () => {
    it('updates price and touches updatedAt', () => {
      // given
      const storeProduct = buildProduct();
      const before = storeProduct.toSnapshot().updatedAt;

      // when
      storeProduct.changePrice(Money.create('24.99'));

      // then
      expect(storeProduct.toSnapshot().price).toBe('24.99');
      expect(storeProduct.toSnapshot().updatedAt.getTime()).toBeGreaterThan(
        before.getTime(),
      );
    });
  });

  describe('setLowStockThreshold', () => {
    it('updates the threshold', () => {
      // given
      const storeProduct = buildProduct({
        lowStockThreshold: LowStockThreshold.create(5),
      });

      // when
      storeProduct.setLowStockThreshold(LowStockThreshold.create(20));

      // then
      expect(storeProduct.toSnapshot().lowStockThreshold).toBe(20);
    });
  });

  describe('update', () => {
    it('does not touch updatedAt when called with empty props', () => {
      // given
      const before = new Date('2026-01-01T00:00:00.000Z');
      const storeProduct = buildProduct({ updatedAt: before });

      // when
      storeProduct.update({});

      // then
      expect(storeProduct.toSnapshot().updatedAt).toEqual(before);
    });

    it('touches updatedAt when at least one prop changes', () => {
      // given
      const before = new Date('2026-01-01T00:00:00.000Z');
      const storeProduct = buildProduct({ updatedAt: before });

      // when
      storeProduct.update({ price: Money.create('99.00') });

      // then
      expect(storeProduct.toSnapshot().updatedAt.getTime()).toBeGreaterThan(
        before.getTime(),
      );
    });
  });
});
