import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'Downtown Store' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  public name!: string;

  @ApiProperty({ example: '15 Main St, Springfield' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public address!: string;
}
