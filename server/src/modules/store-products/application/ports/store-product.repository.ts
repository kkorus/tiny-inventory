import { PaginatedResponse } from '../../../common/types/paginated-response.type';
import { StoreProductView } from '../read-models/store-product-view.read-model';
import { StoreProduct } from '../../domain/store-product.aggregate';

export type StoreProductsListFilters = Readonly<{
  page: number;
  limit: number;
  storeId?: string;
  categoryId?: string;
  sku?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
}>;

export interface StoreProductRepository {
  insert(storeProduct: StoreProduct): Promise<void>;
  findById(id: string): Promise<StoreProduct | null>;
  save(storeProduct: StoreProduct): Promise<void>;
  deleteById(id: string): Promise<boolean>;
  findViewById(id: string): Promise<StoreProductView | null>;
  findViews(
    filters: StoreProductsListFilters,
  ): Promise<PaginatedResponse<StoreProductView>>;
}

export const STORE_PRODUCT_REPOSITORY = Symbol('STORE_PRODUCT_REPOSITORY');
