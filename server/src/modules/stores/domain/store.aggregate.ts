import { StoreId, toStoreId } from './types/identifiers';
import { StoreAddress } from './value-objects/store-address.vo';
import { StoreName } from './value-objects/store-name.vo';

export type CreateStoreProps = Readonly<{
  id: string;
  name: StoreName;
  address: StoreAddress;
  createdAt: Date;
  updatedAt: Date;
}>;

export type StoreUpdateProps = Readonly<{
  name?: StoreName;
  address?: StoreAddress;
}>;

export type StoreSnapshot = Readonly<{
  id: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export class Store {
  private constructor(
    private readonly id: StoreId,
    private name: StoreName,
    private address: StoreAddress,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static create(props: CreateStoreProps): Store {
    return new Store(
      toStoreId(props.id),
      props.name,
      props.address,
      props.createdAt,
      props.updatedAt,
    );
  }

  public update(props: StoreUpdateProps): void {
    if (props.name) {
      this.name = props.name;
    }
    if (props.address) {
      this.address = props.address;
    }
    this.touch();
  }

  public toSnapshot(): StoreSnapshot {
    return {
      id: this.id,
      name: this.name.toString(),
      address: this.address.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
