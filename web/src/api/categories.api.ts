import { httpRequest } from './http-client';
import type { Category, CategoryPayload } from './types';

export function fetchCategories(): Promise<readonly Category[]> {
  return httpRequest<readonly Category[]>('/categories');
}

export function fetchCategory(id: string): Promise<Category> {
  return httpRequest<Category>(`/categories/${id}`);
}

export function createCategory(payload: CategoryPayload): Promise<Category> {
  return httpRequest<Category>('/categories', {
    method: 'POST',
    body: payload,
  });
}

export function updateCategory(
  id: string,
  payload: CategoryPayload,
): Promise<Category> {
  return httpRequest<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await httpRequest<void>(`/categories/${id}`, { method: 'DELETE' });
}
