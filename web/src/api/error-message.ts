import type { ApiError } from './types';

export function toErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as ApiError).message);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error.';
}
