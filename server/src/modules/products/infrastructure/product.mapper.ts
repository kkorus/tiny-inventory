import { ProductEntity } from '../../../infrastructure/persistence/typeorm/entities/product.entity';
import { Product } from '../domain/product.aggregate';
import { ProductName } from '../domain/value-objects/product-name.vo';
import { Sku } from '../domain/value-objects/sku.vo';

export class ProductMapper {
  public static toDomain(entity: ProductEntity): Product {
    return Product.create({
      id: entity.id,
      categoryId: entity.categoryId,
      name: ProductName.create(entity.name),
      sku: Sku.create(entity.sku),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  public static toPersistence(
    product: Product,
  ): Pick<ProductEntity, 'id' | 'categoryId' | 'name' | 'sku' | 'updatedAt'> {
    const snapshot = product.toSnapshot();
    return {
      id: snapshot.id,
      categoryId: snapshot.categoryId,
      name: snapshot.name,
      sku: snapshot.sku,
      updatedAt: snapshot.updatedAt,
    };
  }
}
