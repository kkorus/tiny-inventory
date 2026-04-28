import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../infrastructure/persistence/typeorm/entities/product.entity';
import {
  ProductRepository,
  ProductsRepositoryFindListResult,
} from '../application/ports/product.repository';
import { ProductView } from '../application/read-models/product-view.read-model';
import { Product } from '../domain/product.aggregate';
import { ProductMapper } from './product.mapper';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  public constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  public async insert(product: Product): Promise<void> {
    const payload = ProductMapper.toPersistence(product);
    await this.productsRepository.insert(payload);
  }

  public async findById(id: string): Promise<Product | null> {
    const entity = await this.productsRepository.findOne({
      where: { id },
      select: {
        id: true,
        categoryId: true,
        name: true,
        sku: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!entity) {
      return null;
    }
    return ProductMapper.toDomain(entity);
  }

  public async save(product: Product): Promise<void> {
    const payload = ProductMapper.toPersistence(product);
    await this.productsRepository.update({ id: payload.id }, payload);
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.productsRepository.delete({ id });
    return Boolean(result.affected);
  }

  public async findList(
    page: number,
    limit: number,
  ): Promise<ProductsRepositoryFindListResult> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.productsRepository.findAndCount({
      relations: { category: true },
      order: { createdAt: 'DESC', id: 'ASC' },
      skip,
      take: limit,
    });
    return {
      data: data.map((entity) => this.toView(entity)),
      meta: {
        total,
        page,
        limit,
        hasNext: page * limit < total,
      },
    };
  }

  public async findViewById(id: string): Promise<ProductView | null> {
    const entity = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!entity) {
      return null;
    }
    return this.toView(entity);
  }

  private toView(entity: ProductEntity): ProductView {
    return {
      id: entity.id,
      categoryId: entity.categoryId,
      name: entity.name,
      sku: entity.sku,
      category: {
        id: entity.category.id,
        name: entity.category.name,
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
