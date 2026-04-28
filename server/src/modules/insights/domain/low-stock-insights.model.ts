export type LowStockInsightItem = Readonly<{
  storeProductId: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  lowStockThreshold: number;
}>;

export type LowStockSummaryByStore = Readonly<{
  storeId: string;
  storeName: string;
  count: number;
}>;

export type LowStockSummaryByCategory = Readonly<{
  categoryId: string;
  categoryName: string;
  count: number;
}>;

export type LowStockInsightsSourceData = Readonly<{
  items: readonly LowStockInsightItem[];
  byStore: readonly LowStockSummaryByStore[];
  byCategory: readonly LowStockSummaryByCategory[];
}>;

export type LowStockInsightsReadModel = Readonly<{
  data: readonly LowStockInsightItem[];
  summary: Readonly<{
    totalLowStock: number;
    byStore: readonly LowStockSummaryByStore[];
    byCategory: readonly LowStockSummaryByCategory[];
  }>;
}>;

export class LowStockInsights {
  private constructor(
    private readonly sourceData: LowStockInsightsSourceData,
  ) {}

  public static create(
    sourceData: LowStockInsightsSourceData,
  ): LowStockInsights {
    return new LowStockInsights(sourceData);
  }

  public toReadModel(): LowStockInsightsReadModel {
    return {
      data: this.sourceData.items,
      summary: {
        totalLowStock: this.sourceData.items.length,
        byStore: this.sourceData.byStore,
        byCategory: this.sourceData.byCategory,
      },
    };
  }
}
