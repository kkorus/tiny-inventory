import { Inject, Injectable } from '@nestjs/common';
import { INSIGHTS_REPOSITORY } from './application/ports/insights.repository';
import { LowStockInsights } from './domain/low-stock-insights.model';
import { LowStockQueryDto } from './dto/low-stock-query.dto';
import { LowStockResponseDto } from './dto/low-stock-response.dto';
import type { InsightsRepository } from './application/ports/insights.repository';
import type { LowStockInsightsView } from './application/read-models/low-stock-insights.read-model';

@Injectable()
export class InsightsService {
  public constructor(
    @Inject(INSIGHTS_REPOSITORY)
    private readonly insightsRepository: InsightsRepository,
  ) {}

  public async getLowStockInsights(
    query: LowStockQueryDto,
  ): Promise<LowStockResponseDto> {
    const sourceData = await this.insightsRepository.findLowStockInsights({
      storeId: query.storeId,
      categoryId: query.categoryId,
    });
    const insights = LowStockInsights.create(sourceData);
    const readModel = insights.toReadModel();

    return this.toResponseDto(readModel);
  }

  private toResponseDto(view: LowStockInsightsView): LowStockResponseDto {
    return {
      data: view.data,
      summary: view.summary,
    };
  }
}
