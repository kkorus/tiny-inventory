import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LowStockQueryDto } from './dto/low-stock-query.dto';
import { LowStockResponseDto } from './dto/low-stock-response.dto';
import { InsightsService } from './insights.service';

@ApiTags('insights')
@Controller('insights')
export class InsightsController {
  public constructor(private readonly insightsService: InsightsService) {}

  @Get('low-stock')
  @ApiOperation({
    summary: 'List low-stock inventory lines with aggregated summaries',
  })
  @ApiOkResponse({ type: LowStockResponseDto })
  public getLowStockInsights(
    @Query() query: LowStockQueryDto,
  ): Promise<LowStockResponseDto> {
    return this.insightsService.getLowStockInsights(query);
  }
}
