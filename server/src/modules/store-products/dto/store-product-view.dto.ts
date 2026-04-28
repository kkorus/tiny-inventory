import { ApiProperty } from '@nestjs/swagger';

export class StoreProductViewDto {
  @ApiProperty({ format: 'uuid' })
  public id!: string;

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
  public price!: string;

  @ApiProperty()
  public quantity!: number;

  @ApiProperty()
  public lowStockThreshold!: number;

  @ApiProperty()
  public createdAt!: Date;

  @ApiProperty()
  public updatedAt!: Date;
}
