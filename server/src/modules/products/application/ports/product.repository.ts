import { Product } from '../../domain/product.aggregate';
import { ProductView } from '../read-models/product-view.read-model';

export type ProductsRepositoryFindListResult = Readonly<{
  data: readonly ProductView[];
  meta: Readonly<{
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  }>;
}>;

export interface ProductRepository {
  insert(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  deleteById(id: string): Promise<boolean>;
  findList(
    page: number,
    limit: number,
  ): Promise<ProductsRepositoryFindListResult>;
  findViewById(id: string): Promise<ProductView | null>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
