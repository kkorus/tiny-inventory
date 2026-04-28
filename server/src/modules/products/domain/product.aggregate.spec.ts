import { Product } from './product.aggregate';
import { ProductName } from './value-objects/product-name.vo';
import { Sku } from './value-objects/sku.vo';

describe('Product', () => {
  it('updates name and SKU through aggregate behavior', () => {
    // given
    const product = Product.create({
      id: '7ddd4f82-69d8-46bc-b0a2-0fe53f3f7d9e',
      categoryId: 'f9c53f68-6ea9-44e2-9150-b8f3ef91662f',
      name: ProductName.create('Wireless Mouse'),
      sku: Sku.create('ELEC-MOUSE-001'),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    // when
    product.update({
      name: ProductName.create('Gaming Mouse'),
      sku: Sku.create('ELEC-MOUSE-002'),
    });

    // then
    const snapshot = product.toSnapshot();
    expect(snapshot.name).toBe('Gaming Mouse');
    expect(snapshot.sku).toBe('ELEC-MOUSE-002');
  });
});
