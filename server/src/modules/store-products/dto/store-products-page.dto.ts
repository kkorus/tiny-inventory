import { ApiProperty } from '@nestjs/swagger';
import { StoreProductViewDto } from './store-product-view.dto';

class StoreProductsMetaDto {
  @ApiProperty()
  public total!: number;

  @ApiProperty()
  public page!: number;

  @ApiProperty()
  public limit!: number;

  @ApiProperty()
  public hasNext!: boolean;
}

export class StoreProductsPageDto {
  @ApiProperty({ type: StoreProductViewDto, isArray: true })
  public data!: readonly StoreProductViewDto[];

  @ApiProperty({ type: StoreProductsMetaDto })
  public meta!: StoreProductsMetaDto;
}
