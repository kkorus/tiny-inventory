import { DomainValidationError } from '../../common/domain/errors/domain-validation.error';
import {
  ProductId,
  StoreId,
  StoreProductId,
  toProductId,
  toStoreId,
  toStoreProductId,
} from './types/identifiers';
import { LowStockThreshold } from './value-objects/low-stock-threshold.vo';
import { Money } from './value-objects/money.vo';
import { Quantity } from './value-objects/quantity.vo';

export type CreateStoreProductProps = Readonly<{
  id: string;
  storeId: string;
  productId: string;
  price: Money;
  quantity: Quantity;
  lowStockThreshold: LowStockThreshold;
  createdAt: Date;
  updatedAt: Date;
}>;

export type StoreProductSnapshot = Readonly<{
  id: string;
  storeId: string;
  productId: string;
  price: string;
  quantity: number;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}>;

export type StoreProductUpdateProps = Readonly<{
  storeId?: string;
  productId?: string;
  price?: Money;
  quantity?: Quantity;
  lowStockThreshold?: LowStockThreshold;
}>;

export class StoreProduct {
  private constructor(
    private readonly id: StoreProductId,
    private storeId: StoreId,
    private productId: ProductId,
    private price: Money,
    private quantity: Quantity,
    private lowStockThreshold: LowStockThreshold,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(props: CreateStoreProductProps): StoreProduct {
    return new StoreProduct(
      toStoreProductId(props.id),
      toStoreId(props.storeId),
      toProductId(props.productId),
      props.price,
      props.quantity,
      props.lowStockThreshold,
      props.createdAt,
      props.updatedAt,
    );
  }

  public changePrice(price: Money): void {
    this.price = price;
    this.touch();
  }

  public increaseQuantity(amount: Quantity): void {
    const nextQuantityValue = this.quantity.toNumber() + amount.toNumber();
    this.quantity = Quantity.create(nextQuantityValue);
    this.touch();
  }

  public decreaseQuantity(amount: Quantity): void {
    const nextQuantityValue = this.quantity.toNumber() - amount.toNumber();
    if (nextQuantityValue < 0) {
      throw new DomainValidationError(
        'Cannot decrease quantity below zero for inventory line.',
      );
    }

    this.quantity = Quantity.create(nextQuantityValue);
    this.touch();
  }

  public setLowStockThreshold(lowStockThreshold: LowStockThreshold): void {
    this.lowStockThreshold = lowStockThreshold;
    this.touch();
  }

  public update(props: StoreProductUpdateProps): void {
    let changed = false;

    if (props.storeId !== undefined) {
      this.storeId = toStoreId(props.storeId);
      changed = true;
    }
    if (props.productId !== undefined) {
      this.productId = toProductId(props.productId);
      changed = true;
    }
    if (props.price !== undefined) {
      this.price = props.price;
      changed = true;
    }
    if (props.quantity !== undefined) {
      this.quantity = props.quantity;
      changed = true;
    }
    if (props.lowStockThreshold !== undefined) {
      this.lowStockThreshold = props.lowStockThreshold;
      changed = true;
    }

    if (changed) {
      this.touch();
    }
  }

  public isLowStock(): boolean {
    return this.quantity.toNumber() <= this.lowStockThreshold.toNumber();
  }

  public toSnapshot(): StoreProductSnapshot {
    return {
      id: this.id,
      storeId: this.storeId,
      productId: this.productId,
      price: this.price.toString(),
      quantity: this.quantity.toNumber(),
      lowStockThreshold: this.lowStockThreshold.toNumber(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
