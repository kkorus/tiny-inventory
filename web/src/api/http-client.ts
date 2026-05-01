import type { ApiError, FieldValidationErrorItem } from './types';

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

function parseFieldErrors(
  raw: unknown,
): readonly FieldValidationErrorItem[] | undefined {
  if (!Array.isArray(raw)) {
    return undefined;
  }
  const out: FieldValidationErrorItem[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }
    const rec = item as Record<string, unknown>;
    if (typeof rec.field !== 'string' || !Array.isArray(rec.messages)) {
      continue;
    }
    const messages = rec.messages.filter(
      (m): m is string => typeof m === 'string',
    );
    if (messages.length === 0) {
      continue;
    }
    out.push({ field: rec.field, messages });
  }
  return out.length > 0 ? out : undefined;
}

async function parseApiError(response: Response): Promise<ApiError> {
  let message = `HTTP ${response.status}`;
  let details: readonly string[] | undefined;
  let fieldErrors: readonly FieldValidationErrorItem[] | undefined;
  try {
    const body: unknown = await response.json();
    if (typeof body === 'object' && body !== null) {
      const record = body as Record<string, unknown>;
      fieldErrors = parseFieldErrors(record.errors);
      const msg = record.message;
      if (typeof msg === 'string') {
        message = msg;
      } else if (Array.isArray(msg)) {
        details = msg.filter((item): item is string => typeof item === 'string');
        message = details[0] ?? message;
      }
    }
  } catch {
    // Keep fallback message when response body is not JSON.
  }
  return { status: response.status, message, details, fieldErrors };
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
