import type { ApiError } from './types';

function formatFieldErrors(
  fieldErrors: readonly { field: string; messages: readonly string[] }[],
): string {
  return fieldErrors
    .map((e) => `${e.field}: ${e.messages.join(', ')}`)
    .join('; ');
}

export function toErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const apiErr = error as ApiError;
    const base = String(apiErr.message);
    if (apiErr.fieldErrors && apiErr.fieldErrors.length > 0) {
      return `${base} ${formatFieldErrors(apiErr.fieldErrors)}`;
    }
    return base;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error.';
}
