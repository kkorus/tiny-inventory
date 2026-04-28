import { LowStockInsightsSourceData } from '../../domain/low-stock-insights.model';

export type LowStockInsightsFilters = Readonly<{
  storeId?: string;
  categoryId?: string;
}>;

export interface InsightsRepository {
  findLowStockInsights(
    filters: LowStockInsightsFilters,
  ): Promise<LowStockInsightsSourceData>;
}

export const INSIGHTS_REPOSITORY = Symbol('INSIGHTS_REPOSITORY');
