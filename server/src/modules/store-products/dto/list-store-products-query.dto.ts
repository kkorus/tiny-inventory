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
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import type { ValidationArguments } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

function toNumberOrUndefined(
  value: string | number | null | undefined,
): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return Number(value);
}

@ValidatorConstraint({ name: 'MaxPriceGteMinPrice' })
class MaxPriceGteMinPrice implements ValidatorConstraintInterface {
  public validate(
    maxPrice: number | undefined,
    args: ValidationArguments,
  ): boolean {
    const dto = args.object as ListStoreProductsQueryDto;
    if (dto.minPrice === undefined || maxPrice === undefined) {
      return true;
    }
    return maxPrice >= dto.minPrice;
  }

  public defaultMessage(): string {
    return 'maxPrice must be greater than or equal to minPrice';
  }
}

@ValidatorConstraint({ name: 'MaxQuantityGteMinQuantity' })
class MaxQuantityGteMinQuantity implements ValidatorConstraintInterface {
  public validate(
    maxQuantity: number | undefined,
    args: ValidationArguments,
  ): boolean {
    const dto = args.object as ListStoreProductsQueryDto;
    if (dto.minQuantity === undefined || maxQuantity === undefined) {
      return true;
    }
    return maxQuantity >= dto.minQuantity;
  }

  public defaultMessage(): string {
    return 'maxQuantity must be greater than or equal to minQuantity';
  }
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
  @Validate(MaxPriceGteMinPrice)
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
  @Validate(MaxQuantityGteMinQuantity)
  public maxQuantity?: number;
}
