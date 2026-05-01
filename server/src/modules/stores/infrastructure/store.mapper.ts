import { StoreEntity } from '../../../infrastructure/persistence/typeorm/entities/store.entity';
import { Store } from '../domain/store.aggregate';
import { StoreAddress } from '../domain/value-objects/store-address.vo';
import { StoreName } from '../domain/value-objects/store-name.vo';

export class StoreMapper {
  public static toDomain(entity: StoreEntity): Store {
    return Store.create({
      id: entity.id,
      name: StoreName.create(entity.name),
      address: StoreAddress.create(entity.address),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  public static toPersistence(
    store: Store,
  ): Pick<StoreEntity, 'id' | 'name' | 'address' | 'updatedAt'> {
    const snapshot = store.toSnapshot();
    return {
      id: snapshot.id,
      name: snapshot.name,
      address: snapshot.address,
      updatedAt: snapshot.updatedAt,
    };
  }
}
