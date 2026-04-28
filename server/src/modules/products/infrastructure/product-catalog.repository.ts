import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../infrastructure/persistence/typeorm/entities/category.entity';
import { ProductCatalogRepository } from '../application/ports/product-catalog.repository';

@Injectable()
export class ProductCatalogRepositoryImpl implements ProductCatalogRepository {
  public constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
  ) {}

  public async categoryExists(categoryId: string): Promise<boolean> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
      select: { id: true },
    });
    return Boolean(category);
  }
}
