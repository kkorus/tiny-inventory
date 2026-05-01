export const queryKeys = {
  categories: ['categories'] as const,
  category: (id: string) => ['categories', id] as const,
  products: (page: number, limit: number) =>
    ['products', page, limit] as const,
  product: (id: string) => ['products', id] as const,
  stores: (page: number, limit: number) => ['stores', page, limit] as const,
  store: (id: string) => ['stores', id] as const,
  storeProducts: (paramsKey: string) => ['store-products', paramsKey] as const,
  storeProduct: (id: string) => ['store-products', id] as const,
  insightsLowStock: (paramsKey: string) =>
    ['insights', 'low-stock', paramsKey] as const,
};
