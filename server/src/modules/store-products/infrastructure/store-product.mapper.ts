import { StoreProductEntity } from '../../../infrastructure/persistence/typeorm/entities/store-product.entity';
import { StoreProduct } from '../domain/store-product.aggregate';
import { LowStockThreshold } from '../domain/value-objects/low-stock-threshold.vo';
import { Money } from '../domain/value-objects/money.vo';
import { Quantity } from '../domain/value-objects/quantity.vo';

export class StoreProductMapper {
  public static toDomain(entity: StoreProductEntity): StoreProduct {
    return StoreProduct.create({
      id: entity.id,
      storeId: entity.storeId,
      productId: entity.productId,
      price: Money.create(entity.price),
      quantity: Quantity.create(entity.quantity),
      lowStockThreshold: LowStockThreshold.create(entity.lowStockThreshold),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  public static toPersistence(
    storeProduct: StoreProduct,
  ): Pick<
    StoreProductEntity,
    | 'id'
    | 'storeId'
    | 'productId'
    | 'price'
    | 'quantity'
    | 'lowStockThreshold'
    | 'updatedAt'
  > {
    const snapshot = storeProduct.toSnapshot();
    return {
      id: snapshot.id,
      storeId: snapshot.storeId,
      productId: snapshot.productId,
      price: snapshot.price,
      quantity: snapshot.quantity,
      lowStockThreshold: snapshot.lowStockThreshold,
      updatedAt: snapshot.updatedAt,
    };
  }
}
