import { httpRequest, toQueryString } from './http-client';
import type { PaginatedResponse, Store, StorePayload } from './types';

export function fetchStores(
  page: number,
  limit: number,
): Promise<PaginatedResponse<Store>> {
  return httpRequest<PaginatedResponse<Store>>(
    `/stores${toQueryString({ page, limit })}`,
  );
}

export function fetchStore(id: string): Promise<Store> {
  return httpRequest<Store>(`/stores/${id}`);
}

export function createStore(payload: StorePayload): Promise<Store> {
  return httpRequest<Store>('/stores', { method: 'POST', body: payload });
}

export function updateStore(
  id: string,
  payload: Partial<StorePayload>,
): Promise<Store> {
  return httpRequest<Store>(`/stores/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteStore(id: string): Promise<void> {
  return httpRequest<void>(`/stores/${id}`, { method: 'DELETE' });
}
