import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export function toNumberOrUndefined(
  value: string | number | null | undefined,
): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return Number(value);
}

export class ListStoreProductsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  public storeId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  public categoryId?: string;

  @ApiPropertyOptional({ example: 'ELEC-MOUSE-001' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Matches(/^[A-Z0-9-]+$/)
  public sku?: string;

  @ApiPropertyOptional({ example: 10.5 })
  @IsOptional()
  @Transform(({ value }) =>
    toNumberOrUndefined(value as string | number | null | undefined),
  )
  @IsNumber()
  @Min(0)
  public minPrice?: number;

  @ApiPropertyOptional({ example: 99.9 })
  @IsOptional()
  @Transform(({ value }) =>
    toNumberOrUndefined(value as string | number | null | undefined),
  )
  @IsNumber()
  @Min(0)
  public maxPrice?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Transform(({ value }) =>
    toNumberOrUndefined(value as string | number | null | undefined),
  )
  @IsNumber()
  @Min(0)
  public minQuantity?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Transform(({ value }) =>
    toNumberOrUndefined(value as string | number | null | undefined),
  )
  @IsNumber()
  @Min(0)
  public maxQuantity?: number;
}
