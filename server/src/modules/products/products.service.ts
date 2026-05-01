import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/types/paginated-response.type';
import { isUniqueViolation } from '../common/utils/is-unique-violation.util';
import { PRODUCT_CATALOG_REPOSITORY } from './application/ports/product-catalog.repository';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository';
import { ProductView } from './application/read-models/product-view.read-model';
import type { ProductCatalogRepository } from './application/ports/product-catalog.repository';
import type { ProductRepository } from './application/ports/product.repository';
import { DomainValidationError } from '../common/domain/errors/domain-validation.error';
import { Product } from './domain/product.aggregate';
import { ProductName } from './domain/value-objects/product-name.vo';
import { Sku } from './domain/value-objects/sku.vo';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { randomUUID } from 'node:crypto';

export type ProductsListResponse = PaginatedResponse<ProductResponseDto>;

@Injectable()
export class ProductsService {
  public constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productsRepository: ProductRepository,
    @Inject(PRODUCT_CATALOG_REPOSITORY)
    private readonly productCatalogRepository: ProductCatalogRepository,
  ) {}

  public async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    await this.ensureCategoryExists(createProductDto.categoryId);

    try {
      const now = new Date();
      const product = Product.create({
        id: randomUUID(),
        categoryId: createProductDto.categoryId,
        name: ProductName.create(createProductDto.name),
        sku: Sku.create(createProductDto.sku),
        createdAt: now,
        updatedAt: now,
      });

      await this.productsRepository.insert(product);
      return this.findOne(product.toSnapshot().id);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        throw new BadRequestException(error.message);
      }
      if (isUniqueViolation(error as { code?: string })) {
        throw new ConflictException('SKU already exists.');
      }
      throw error;
    }
  }

  public async findAll(
    pagination: PaginationQueryDto,
  ): Promise<ProductsListResponse> {
    const response = await this.productsRepository.findList(
      pagination.page,
      pagination.limit,
    );
    return {
      data: response.data.map((item) => this.toResponseDto(item)),
      meta: response.meta,
    };
  }

  public async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findViewById(id);
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" was not found.`);
    }
    return this.toResponseDto(product);
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" was not found.`);
    }

    if (updateProductDto.categoryId) {
      await this.ensureCategoryExists(updateProductDto.categoryId);
    }

    try {
      product.update({
        categoryId: updateProductDto.categoryId,
        name: updateProductDto.name
          ? ProductName.create(updateProductDto.name)
          : undefined,
        sku: updateProductDto.sku
          ? Sku.create(updateProductDto.sku)
          : undefined,
      });
      await this.productsRepository.save(product);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        throw new BadRequestException(error.message);
      }
      if (isUniqueViolation(error as { code?: string })) {
        throw new ConflictException('SKU already exists.');
      }
      throw error;
    }
  }

  public async remove(id: string): Promise<void> {
    const isDeleted = await this.productsRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Product with id "${id}" was not found.`);
    }
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const exists =
      await this.productCatalogRepository.categoryExists(categoryId);
    if (!exists) {
      throw new NotFoundException(
        `Category with id "${categoryId}" was not found.`,
      );
    }
  }

  private toResponseDto(view: ProductView): ProductResponseDto {
    return {
      id: view.id,
      categoryId: view.categoryId,
      name: view.name,
      sku: view.sku,
      category: {
        id: view.category.id,
        name: view.category.name,
      },
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
    };
  }
}
