import { ApiProperty } from '@nestjs/swagger';

class LowStockItemDto {
  @ApiProperty({ format: 'uuid' })
  public storeProductId!: string;

  @ApiProperty({ format: 'uuid' })
  public storeId!: string;

  @ApiProperty()
  public storeName!: string;

  @ApiProperty({ format: 'uuid' })
  public productId!: string;

  @ApiProperty()
  public productName!: string;

  @ApiProperty()
  public sku!: string;

  @ApiProperty({ format: 'uuid' })
  public categoryId!: string;

  @ApiProperty()
  public categoryName!: string;

  @ApiProperty()
  public quantity!: number;

  @ApiProperty()
  public lowStockThreshold!: number;
}

class LowStockByStoreDto {
  @ApiProperty({ format: 'uuid' })
  public storeId!: string;

  @ApiProperty()
  public storeName!: string;

  @ApiProperty()
  public count!: number;
}

class LowStockByCategoryDto {
  @ApiProperty({ format: 'uuid' })
  public categoryId!: string;

  @ApiProperty()
  public categoryName!: string;

  @ApiProperty()
  public count!: number;
}

class LowStockSummaryDto {
  @ApiProperty()
  public totalLowStock!: number;

  @ApiProperty({ type: LowStockByStoreDto, isArray: true })
  public byStore!: readonly LowStockByStoreDto[];

  @ApiProperty({ type: LowStockByCategoryDto, isArray: true })
  public byCategory!: readonly LowStockByCategoryDto[];
}

export class LowStockResponseDto {
  @ApiProperty({ type: LowStockItemDto, isArray: true })
  public data!: readonly LowStockItemDto[];

  @ApiProperty({ type: LowStockSummaryDto })
  public summary!: LowStockSummaryDto;
}
