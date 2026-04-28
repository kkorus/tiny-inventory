import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Mouse' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  public name!: string;

  @ApiProperty({ example: 'ELEC-MOUSE-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'SKU can contain only uppercase letters, digits and dashes.',
  })
  public sku!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  public categoryId!: string;
}
