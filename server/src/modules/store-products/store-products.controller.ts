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
import { PaginatedResponse } from '../common/types/paginated-response.type';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { ListStoreProductsQueryDto } from './dto/list-store-products-query.dto';
import { StoreProductViewDto } from './dto/store-product-view.dto';
import { StoreProductsPageDto } from './dto/store-products-page.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { StoreProductsService } from './store-products.service';

@ApiTags('store-products')
@Controller('store-products')
export class StoreProductsController {
  public constructor(
    private readonly storeProductsService: StoreProductsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create store inventory line' })
  @ApiCreatedResponse({ type: StoreProductViewDto })
  public create(
    @Body() createStoreProductDto: CreateStoreProductDto,
  ): Promise<StoreProductViewDto> {
    return this.storeProductsService.create(createStoreProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List inventory lines with filtering and pagination',
  })
  @ApiOkResponse({ type: StoreProductsPageDto })
  public findAll(
    @Query() query: ListStoreProductsQueryDto,
  ): Promise<PaginatedResponse<StoreProductViewDto>> {
    return this.storeProductsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory line by id' })
  @ApiOkResponse({ type: StoreProductViewDto })
  public findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<StoreProductViewDto> {
    return this.storeProductsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory line by id' })
  @ApiOkResponse({ type: StoreProductViewDto })
  public update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateStoreProductDto: UpdateStoreProductDto,
  ): Promise<StoreProductViewDto> {
    return this.storeProductsService.update(id, updateStoreProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete inventory line by id' })
  @ApiNoContentResponse()
  public async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.storeProductsService.remove(id);
  }
}
