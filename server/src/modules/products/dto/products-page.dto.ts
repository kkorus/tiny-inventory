import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

class ProductsMetaDto {
  @ApiProperty()
  public total!: number;

  @ApiProperty()
  public page!: number;

  @ApiProperty()
  public limit!: number;

  @ApiProperty()
  public hasNext!: boolean;
}

export class ProductsPageDto {
  @ApiProperty({ type: ProductResponseDto, isArray: true })
  public data!: readonly ProductResponseDto[];

  @ApiProperty({ type: ProductsMetaDto })
  public meta!: ProductsMetaDto;
}
