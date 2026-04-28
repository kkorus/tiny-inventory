import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { StoreProductEntity } from '../../../infrastructure/persistence/typeorm/entities/store-product.entity';
import {
  StoreProductRepository,
  StoreProductsListFilters,
} from '../application/ports/store-product.repository';
import { PaginatedResponse } from '../../common/types/paginated-response.type';
import { StoreProductView } from '../application/read-models/store-product-view.read-model';
import { StoreProduct } from '../domain/store-product.aggregate';
import { StoreProductMapper } from './store-product.mapper';

@Injectable()
export class StoreProductRepositoryImpl implements StoreProductRepository {
  public constructor(
    @InjectRepository(StoreProductEntity)
    private readonly storeProductsRepository: Repository<StoreProductEntity>,
  ) {}

  public async insert(storeProduct: StoreProduct): Promise<void> {
    const payload = StoreProductMapper.toPersistence(storeProduct);
    await this.storeProductsRepository.insert(payload);
  }

  public async findById(id: string): Promise<StoreProduct | null> {
    const entity = await this.storeProductsRepository.findOne({
      where: { id },
      select: {
        id: true,
        storeId: true,
        productId: true,
        price: true,
        quantity: true,
        lowStockThreshold: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!entity) {
      return null;
    }

    return StoreProductMapper.toDomain(entity);
  }

  public async save(storeProduct: StoreProduct): Promise<void> {
    const payload = StoreProductMapper.toPersistence(storeProduct);
    await this.storeProductsRepository.update({ id: payload.id }, payload);
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.storeProductsRepository.delete({ id });
    return Boolean(result.affected);
  }

  public async findViewById(id: string): Promise<StoreProductView | null> {
    const entity = await this.withJoins()
      .where('storeProduct.id = :id', { id })
      .getOne();

    if (!entity) {
      return null;
    }

    return this.toView(entity);
  }

  public async findViews(
    filters: StoreProductsListFilters,
  ): Promise<PaginatedResponse<StoreProductView>> {
    const queryBuilder = this.withJoins();

    if (filters.storeId) {
      queryBuilder.andWhere('storeProduct.storeId = :storeId', {
        storeId: filters.storeId,
      });
    }
    if (filters.categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }
    if (filters.sku) {
      queryBuilder.andWhere('product.sku = :sku', { sku: filters.sku });
    }
    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('storeProduct.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }
    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('storeProduct.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }
    if (filters.minQuantity !== undefined) {
      queryBuilder.andWhere('storeProduct.quantity >= :minQuantity', {
        minQuantity: filters.minQuantity,
      });
    }
    if (filters.maxQuantity !== undefined) {
      queryBuilder.andWhere('storeProduct.quantity <= :maxQuantity', {
        maxQuantity: filters.maxQuantity,
      });
    }

    queryBuilder
      .orderBy('storeProduct.createdAt', 'DESC')
      .addOrderBy('storeProduct.id', 'ASC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit);

    const [rows, total] = await queryBuilder.getManyAndCount();

    return {
      data: rows.map((row) => this.toView(row)),
      meta: {
        total,
        page: filters.page,
        limit: filters.limit,
        hasNext: filters.page * filters.limit < total,
      },
    };
  }

  private withJoins(): SelectQueryBuilder<StoreProductEntity> {
    return this.storeProductsRepository
      .createQueryBuilder('storeProduct')
      .innerJoinAndSelect('storeProduct.store', 'store')
      .innerJoinAndSelect('storeProduct.product', 'product')
      .innerJoinAndSelect('product.category', 'category');
  }

  private toView(entity: StoreProductEntity): StoreProductView {
    return {
      id: entity.id,
      storeId: entity.storeId,
      storeName: entity.store.name,
      productId: entity.productId,
      productName: entity.product.name,
      sku: entity.product.sku,
      categoryId: entity.product.categoryId,
      categoryName: entity.product.category.name,
      price: entity.price,
      quantity: entity.quantity,
      lowStockThreshold: entity.lowStockThreshold,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
