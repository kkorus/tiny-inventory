import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductsPageDto } from './dto/products-page.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsListResponse, ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  public constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create catalog product' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  public create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List catalog products' })
  @ApiOkResponse({ type: ProductsPageDto })
  public findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<ProductsListResponse> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get catalog product by id' })
  @ApiOkResponse({ type: ProductResponseDto })
  public findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update catalog product by id' })
  @ApiOkResponse({ type: ProductResponseDto })
  public update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete catalog product by id' })
  @ApiNoContentResponse()
  public async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.productsService.remove(id);
  }
}
