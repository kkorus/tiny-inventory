import { ApiProperty } from '@nestjs/swagger';
import { StoreResponseDto } from './store-response.dto';

class StoresMetaDto {
  @ApiProperty()
  public total!: number;

  @ApiProperty()
  public page!: number;

  @ApiProperty()
  public limit!: number;

  @ApiProperty()
  public hasNext!: boolean;
}

export class StoresPageDto {
  @ApiProperty({ type: StoreResponseDto, isArray: true })
  public data!: readonly StoreResponseDto[];

  @ApiProperty({ type: StoresMetaDto })
  public meta!: StoresMetaDto;
}
