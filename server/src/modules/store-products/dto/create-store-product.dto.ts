import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumberString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateStoreProductDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  public storeId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  public productId!: string;

  @ApiProperty({ example: '24.99' })
  @IsNumberString({ no_symbols: false })
  @MaxLength(16)
  public price!: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(0)
  @Max(1_000_000)
  public quantity!: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  @Max(1_000_000)
  public lowStockThreshold!: number;
}
