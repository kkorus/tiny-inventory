import { PaginatedResponse } from '../../../common/types/paginated-response.type';
import { Store } from '../../domain/store.aggregate';
import { StoreView } from '../read-models/store-view.read-model';

export interface StoreRepository {
  insert(store: Store): Promise<void>;
  findById(id: string): Promise<Store | null>;
  save(store: Store): Promise<void>;
  deleteById(id: string): Promise<boolean>;
  findList(page: number, limit: number): Promise<PaginatedResponse<StoreView>>;
  findViewById(id: string): Promise<StoreView | null>;
}

export const STORE_REPOSITORY = Symbol('STORE_REPOSITORY');
