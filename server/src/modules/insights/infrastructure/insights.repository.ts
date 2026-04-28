import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { StoreProductEntity } from '../../../infrastructure/persistence/typeorm/entities/store-product.entity';
import {
  InsightsRepository,
  LowStockInsightsFilters,
} from '../application/ports/insights.repository';
import { LowStockInsightsSourceData } from '../domain/low-stock-insights.model';

type LowStockByStoreRow = Readonly<{
  storeId: string;
  storeName: string;
  count: string;
}>;

type LowStockByCategoryRow = Readonly<{
  categoryId: string;
  categoryName: string;
  count: string;
}>;

@Injectable()
export class InsightsRepositoryImpl implements InsightsRepository {
  public constructor(
    @InjectRepository(StoreProductEntity)
    private readonly storeProductsRepository: Repository<StoreProductEntity>,
  ) {}

  public async findLowStockInsights(
    filters: LowStockInsightsFilters,
  ): Promise<LowStockInsightsSourceData> {
    const baseQuery = this.baseQuery(filters);

    const lowStockRows = await baseQuery
      .clone()
      .orderBy('storeProduct.quantity', 'ASC')
      .addOrderBy('storeProduct.id', 'ASC')
      .getMany();

    const byStoreRaw = await baseQuery
      .clone()
      .select('store.id', 'storeId')
      .addSelect('store.name', 'storeName')
      .addSelect('COUNT(storeProduct.id)', 'count')
      .groupBy('store.id')
      .addGroupBy('store.name')
      .orderBy('count', 'DESC')
      .addOrderBy('store.name', 'ASC')
      .getRawMany<LowStockByStoreRow>();

    const byCategoryRaw = await baseQuery
      .clone()
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(storeProduct.id)', 'count')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('count', 'DESC')
      .addOrderBy('category.name', 'ASC')
      .getRawMany<LowStockByCategoryRow>();

    return {
      items: lowStockRows.map((row) => ({
        storeProductId: row.id,
        storeId: row.storeId,
        storeName: row.store.name,
        productId: row.productId,
        productName: row.product.name,
        sku: row.product.sku,
        categoryId: row.product.categoryId,
        categoryName: row.product.category.name,
        quantity: row.quantity,
        lowStockThreshold: row.lowStockThreshold,
      })),
      byStore: byStoreRaw.map((row) => ({
        storeId: row.storeId,
        storeName: row.storeName,
        count: Number(row.count),
      })),
      byCategory: byCategoryRaw.map((row) => ({
        categoryId: row.categoryId,
        categoryName: row.categoryName,
        count: Number(row.count),
      })),
    };
  }

  private baseQuery(
    filters: LowStockInsightsFilters,
  ): SelectQueryBuilder<StoreProductEntity> {
    const queryBuilder = this.storeProductsRepository
      .createQueryBuilder('storeProduct')
      .innerJoinAndSelect('storeProduct.store', 'store')
      .innerJoinAndSelect('storeProduct.product', 'product')
      .innerJoinAndSelect('product.category', 'category')
      .where('storeProduct.quantity <= storeProduct.lowStockThreshold');

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

    return queryBuilder;
  }
}
