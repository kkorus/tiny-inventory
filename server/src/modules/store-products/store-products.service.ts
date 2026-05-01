import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from '../common/types/paginated-response.type';
import { isUniqueViolation } from '../common/utils/is-unique-violation.util';
import { INVENTORY_CATALOG_REPOSITORY } from './application/ports/inventory-catalog.repository';
import { STORE_PRODUCT_REPOSITORY } from './application/ports/store-product.repository';
import { StoreProductView } from './application/read-models/store-product-view.read-model';
import type { InventoryCatalogRepository } from './application/ports/inventory-catalog.repository';
import type { StoreProductRepository } from './application/ports/store-product.repository';
import { DomainValidationError } from '../common/domain/errors/domain-validation.error';
import { StoreProduct } from './domain/store-product.aggregate';
import { LowStockThreshold } from './domain/value-objects/low-stock-threshold.vo';
import { Money } from './domain/value-objects/money.vo';
import { Quantity } from './domain/value-objects/quantity.vo';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { ListStoreProductsQueryDto } from './dto/list-store-products-query.dto';
import { StoreProductViewDto } from './dto/store-product-view.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class StoreProductsService {
  public constructor(
    @Inject(STORE_PRODUCT_REPOSITORY)
    private readonly storeProductRepository: StoreProductRepository,
    @Inject(INVENTORY_CATALOG_REPOSITORY)
    private readonly inventoryCatalogRepository: InventoryCatalogRepository,
  ) {}

  public async create(
    createStoreProductDto: CreateStoreProductDto,
  ): Promise<StoreProductViewDto> {
    await this.ensureStoreExists(createStoreProductDto.storeId);
    await this.ensureProductExists(createStoreProductDto.productId);

    try {
      const now = new Date();
      const newId = randomUUID();
      const storeProduct = StoreProduct.create({
        id: newId,
        storeId: createStoreProductDto.storeId,
        productId: createStoreProductDto.productId,
        price: Money.create(createStoreProductDto.price),
        quantity: Quantity.create(createStoreProductDto.quantity),
        lowStockThreshold: LowStockThreshold.create(
          createStoreProductDto.lowStockThreshold,
        ),
        createdAt: now,
        updatedAt: now,
      });

      await this.storeProductRepository.insert(storeProduct);
      return this.findOne(newId);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        throw new BadRequestException(error.message);
      }
      if (isUniqueViolation(error as { code?: string })) {
        throw new ConflictException(
          'Store-product pair already exists. Update the existing inventory line instead.',
        );
      }
      throw error;
    }
  }

  public async findAll(
    query: ListStoreProductsQueryDto,
  ): Promise<PaginatedResponse<StoreProductViewDto>> {
    const response = await this.storeProductRepository.findViews({
      page: query.page,
      limit: query.limit,
      storeId: query.storeId,
      categoryId: query.categoryId,
      sku: query.sku,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      minQuantity: query.minQuantity,
      maxQuantity: query.maxQuantity,
    });
    return {
      data: response.data.map((item) => this.toViewDto(item)),
      meta: response.meta,
    };
  }

  public async findOne(id: string): Promise<StoreProductViewDto> {
    const entity = await this.storeProductRepository.findViewById(id);
    if (!entity) {
      throw new NotFoundException(
        `Store product with id "${id}" was not found.`,
      );
    }

    return this.toViewDto(entity);
  }

  public async update(
    id: string,
    updateStoreProductDto: UpdateStoreProductDto,
  ): Promise<StoreProductViewDto> {
    const current = await this.storeProductRepository.findById(id);
    if (!current) {
      throw new NotFoundException(
        `Store product with id "${id}" was not found.`,
      );
    }

    if (updateStoreProductDto.storeId) {
      await this.ensureStoreExists(updateStoreProductDto.storeId);
    }
    if (updateStoreProductDto.productId) {
      await this.ensureProductExists(updateStoreProductDto.productId);
    }

    try {
      current.update({
        storeId: updateStoreProductDto.storeId,
        productId: updateStoreProductDto.productId,
        price:
          updateStoreProductDto.price !== undefined
            ? Money.create(updateStoreProductDto.price)
            : undefined,
        quantity:
          updateStoreProductDto.quantity !== undefined
            ? Quantity.create(updateStoreProductDto.quantity)
            : undefined,
        lowStockThreshold:
          updateStoreProductDto.lowStockThreshold !== undefined
            ? LowStockThreshold.create(updateStoreProductDto.lowStockThreshold)
            : undefined,
      });
      await this.storeProductRepository.save(current);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        throw new BadRequestException(error.message);
      }
      if (isUniqueViolation(error as { code?: string })) {
        throw new ConflictException(
          'Store-product pair already exists. Update the existing inventory line instead.',
        );
      }
      throw error;
    }
  }

  public async remove(id: string): Promise<void> {
    const isDeleted = await this.storeProductRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(
        `Store product with id "${id}" was not found.`,
      );
    }
  }

  private async ensureStoreExists(storeId: string): Promise<void> {
    const exists = await this.inventoryCatalogRepository.storeExists(storeId);
    if (!exists) {
      throw new NotFoundException(`Store with id "${storeId}" was not found.`);
    }
  }

  private async ensureProductExists(productId: string): Promise<void> {
    const exists =
      await this.inventoryCatalogRepository.productExists(productId);
    if (!exists) {
      throw new NotFoundException(
        `Product with id "${productId}" was not found.`,
      );
    }
  }

  private toViewDto(view: StoreProductView): StoreProductViewDto {
    return {
      id: view.id,
      storeId: view.storeId,
      storeName: view.storeName,
      productId: view.productId,
      productName: view.productName,
      sku: view.sku,
      categoryId: view.categoryId,
      categoryName: view.categoryName,
      price: view.price,
      quantity: view.quantity,
      lowStockThreshold: view.lowStockThreshold,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
    };
  }
}
