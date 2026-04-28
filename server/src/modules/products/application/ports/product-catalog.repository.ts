export interface ProductCatalogRepository {
  categoryExists(categoryId: string): Promise<boolean>;
}

export const PRODUCT_CATALOG_REPOSITORY = Symbol('PRODUCT_CATALOG_REPOSITORY');
