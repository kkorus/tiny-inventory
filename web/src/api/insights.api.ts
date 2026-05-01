import { httpRequest, toQueryString } from './http-client';
import type { LowStockInsightsFilters, LowStockInsightsResponse } from './types';

function normalizeFilters(filters: LowStockInsightsFilters): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      mapped[key] = String(value);
    }
  }
  return mapped;
}

export function fetchLowStockInsights(
  filters: LowStockInsightsFilters,
): Promise<LowStockInsightsResponse> {
  return httpRequest<LowStockInsightsResponse>(
    `/insights/low-stock${toQueryString(normalizeFilters(filters))}`,
  );
}
