export type PaginatedMeta = Readonly<{
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}>;

export type PaginatedResponse<T> = Readonly<{
  data: readonly T[];
  meta: PaginatedMeta;
}>;

export type Category = Readonly<{
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}>;

export type CategoryPayload = Readonly<{
  name: string;
}>;

export type Product = Readonly<{
  id: string;
  categoryId: string;
  name: string;
  sku: string;
  category: Readonly<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}>;

export type Store = Readonly<{
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}>;

export type StoreProduct = Readonly<{
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  price: string;
  quantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}>;

export type ProductPayload = Readonly<{
  name: string;
  sku: string;
  categoryId: string;
}>;

export type StorePayload = Readonly<{
  name: string;
  address: string;
}>;

export type StoreProductPayload = Readonly<{
  storeId: string;
  productId: string;
  price: string;
  quantity: number;
  lowStockThreshold: number;
}>;

export type StoreProductFilters = Readonly<{
  page?: number;
  limit?: number;
  storeId?: string;
  categoryId?: string;
  sku?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
}>;

export type LowStockInsightsFilters = Readonly<{
  storeId?: string;
  categoryId?: string;
}>;

export type LowStockItem = Readonly<{
  storeProductId: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  lowStockThreshold: number;
}>;

export type LowStockByStore = Readonly<{
  storeId: string;
  storeName: string;
  count: number;
}>;

export type LowStockByCategory = Readonly<{
  categoryId: string;
  categoryName: string;
  count: number;
}>;

export type LowStockSummary = Readonly<{
  totalLowStock: number;
  byStore: readonly LowStockByStore[];
  byCategory: readonly LowStockByCategory[];
}>;

export type LowStockInsightsResponse = Readonly<{
  data: readonly LowStockItem[];
  summary: LowStockSummary;
}>;

export type FieldValidationErrorItem = Readonly<{
  field: string;
  messages: readonly string[];
}>;

export type ApiError = Readonly<{
  status: number;
  message: string;
  details?: readonly string[];
  fieldErrors?: readonly FieldValidationErrorItem[];
}>;
