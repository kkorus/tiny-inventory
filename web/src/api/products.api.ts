import { httpRequest, toQueryString } from './http-client';
import type { PaginatedResponse, Product, ProductPayload } from './types';

export function fetchProducts(
  page: number,
  limit: number,
): Promise<PaginatedResponse<Product>> {
  return httpRequest<PaginatedResponse<Product>>(
    `/products${toQueryString({ page, limit })}`,
  );
}

export function fetchProduct(id: string): Promise<Product> {
  return httpRequest<Product>(`/products/${id}`);
}

export function createProduct(payload: ProductPayload): Promise<Product> {
  return httpRequest<Product>('/products', { method: 'POST', body: payload });
}

export function updateProduct(
  id: string,
  payload: Partial<ProductPayload>,
): Promise<Product> {
  return httpRequest<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteProduct(id: string): Promise<void> {
  return httpRequest<void>(`/products/${id}`, { method: 'DELETE' });
}
