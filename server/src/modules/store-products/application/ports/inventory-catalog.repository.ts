export interface InventoryCatalogRepository {
  storeExists(storeId: string): Promise<boolean>;
  productExists(productId: string): Promise<boolean>;
}

export const INVENTORY_CATALOG_REPOSITORY = Symbol(
  'INVENTORY_CATALOG_REPOSITORY',
);
