import { ApiProperty } from '@nestjs/swagger';

export class ProductCategorySummaryDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty()
  public name!: string;
}

export class ProductResponseDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

  @ApiProperty({ format: 'uuid' })
  public categoryId!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public sku!: string;

  @ApiProperty({ type: ProductCategorySummaryDto })
  public category!: ProductCategorySummaryDto;

  @ApiProperty()
  public createdAt!: Date;

  @ApiProperty()
  public updatedAt!: Date;
}
