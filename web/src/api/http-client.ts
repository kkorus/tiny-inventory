import type { ApiError } from './types';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestOptions = Readonly<{
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
}>;

function buildBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  const base =
    typeof raw === 'string' && raw.length > 0 ? raw.replace(/\/$/, '') : '';
  return base || '';
}

function toQueryString(
  query: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  const serialized = params.toString();
  return serialized.length > 0 ? `?${serialized}` : '';
}

async function parseApiError(response: Response): Promise<ApiError> {
  let message = `HTTP ${response.status}`;
  let details: readonly string[] | undefined;
  try {
    const body: unknown = await response.json();
    if (
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
    ) {
      message = body.message;
    } else if (
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      Array.isArray(body.message)
    ) {
      details = body.message.filter(
        (item): item is string => typeof item === 'string',
      );
      message = details[0] ?? message;
    }
  } catch {
    // Keep fallback message when response body is not JSON.
  }
  return { status: response.status, message, details };
}

export async function httpRequest<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const response = await fetch(`${buildBaseUrl()}/api${path}`, {
    method: options?.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    signal: options?.signal,
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export { toQueryString };
