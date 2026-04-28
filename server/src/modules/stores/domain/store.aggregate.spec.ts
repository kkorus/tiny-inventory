import { Store } from './store.aggregate';
import { StoreAddress } from './value-objects/store-address.vo';
import { StoreName } from './value-objects/store-name.vo';

describe('Store', () => {
  it('updates name and address with aggregate behavior', () => {
    // given
    const store = Store.create({
      id: 'f3253d00-d34d-4cf7-97c4-2e1f703e4e76',
      name: StoreName.create('Downtown Store'),
      address: StoreAddress.create('15 Main St, Springfield'),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    // when
    store.update({
      name: StoreName.create('Uptown Store'),
      address: StoreAddress.create('25 South St, Springfield'),
    });

    // then
    const snapshot = store.toSnapshot();
    expect(snapshot.name).toBe('Uptown Store');
    expect(snapshot.address).toBe('25 South St, Springfield');
  });
});
