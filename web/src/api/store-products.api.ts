import { httpRequest, toQueryString } from './http-client';
import type {
  PaginatedResponse,
  StoreProduct,
  StoreProductFilters,
  StoreProductPayload,
} from './types';

function normalizeFilters(filters: StoreProductFilters): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      mapped[key] = String(value);
    }
  }
  return mapped;
}

export function fetchStoreProducts(
  filters: StoreProductFilters,
): Promise<PaginatedResponse<StoreProduct>> {
  return httpRequest<PaginatedResponse<StoreProduct>>(
    `/store-products${toQueryString(normalizeFilters(filters))}`,
  );
}

export function fetchStoreProduct(id: string): Promise<StoreProduct> {
  return httpRequest<StoreProduct>(`/store-products/${id}`);
}

export function createStoreProduct(
  payload: StoreProductPayload,
): Promise<StoreProduct> {
  return httpRequest<StoreProduct>('/store-products', {
    method: 'POST',
    body: payload,
  });
}

export function updateStoreProduct(
  id: string,
  payload: Partial<StoreProductPayload>,
): Promise<StoreProduct> {
  return httpRequest<StoreProduct>(`/store-products/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteStoreProduct(id: string): Promise<void> {
  return httpRequest<void>(`/store-products/${id}`, { method: 'DELETE' });
}
