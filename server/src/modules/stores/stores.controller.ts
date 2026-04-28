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
import { PaginatedResponse } from '../common/types/paginated-response.type';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { StoresPageDto } from './dto/stores-page.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  public constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: 'Create store' })
  @ApiCreatedResponse({ type: StoreResponseDto })
  public create(
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<StoreResponseDto> {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'List stores' })
  @ApiOkResponse({ type: StoresPageDto })
  public findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<StoreResponseDto>> {
    return this.storesService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by id' })
  @ApiOkResponse({ type: StoreResponseDto })
  public findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<StoreResponseDto> {
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store by id' })
  @ApiOkResponse({ type: StoreResponseDto })
  public update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete store by id' })
  @ApiNoContentResponse()
  public async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.storesService.remove(id);
  }
}
