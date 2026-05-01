import {
  CategoryId,
  ProductId,
  toCategoryId,
  toProductId,
} from './types/identifiers';
import { ProductName } from './value-objects/product-name.vo';
import { Sku } from './value-objects/sku.vo';

export type CreateProductProps = Readonly<{
  id: string;
  categoryId: string;
  name: ProductName;
  sku: Sku;
  createdAt: Date;
  updatedAt: Date;
}>;

export type ProductUpdateProps = Readonly<{
  categoryId?: string;
  name?: ProductName;
  sku?: Sku;
}>;

export type ProductSnapshot = Readonly<{
  id: string;
  categoryId: string;
  name: string;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export class Product {
  private constructor(
    private readonly id: ProductId,
    private categoryId: CategoryId,
    private name: ProductName,
    private sku: Sku,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(props: CreateProductProps): Product {
    return new Product(
      toProductId(props.id),
      toCategoryId(props.categoryId),
      props.name,
      props.sku,
      props.createdAt,
      props.updatedAt,
    );
  }

  public update(props: ProductUpdateProps): void {
    let changed = false;

    if (props.categoryId !== undefined) {
      this.categoryId = toCategoryId(props.categoryId);
      changed = true;
    }
    if (props.name !== undefined) {
      this.name = props.name;
      changed = true;
    }
    if (props.sku !== undefined) {
      this.sku = props.sku;
      changed = true;
    }

    if (changed) {
      this.touch();
    }
  }

  public toSnapshot(): ProductSnapshot {
    return {
      id: this.id,
      categoryId: this.categoryId,
      name: this.name.toString(),
      sku: this.sku.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
