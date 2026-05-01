import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../infrastructure/persistence/typeorm/entities/category.entity';
import { ProductEntity } from '../../../infrastructure/persistence/typeorm/entities/product.entity';
import { CategoryRepository } from '../application/ports/category.repository';
import { CategoryView } from '../application/read-models/category-view.read-model';

@Injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
  public constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  public async findAll(): Promise<readonly CategoryView[]> {
    const categories = await this.categoriesRepository.find({
      order: { name: 'ASC' },
    });

    return categories.map((category) => this.entityToView(category));
  }

  public async findById(id: string): Promise<CategoryView | null> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });
    return category === null ? null : this.entityToView(category);
  }

  public async persist(id: string, name: string): Promise<CategoryView> {
    const entity = this.categoriesRepository.create({ id, name });
    const saved = await this.categoriesRepository.save(entity);
    return this.entityToView(saved);
  }

  public async updateName(
    id: string,
    name: string,
  ): Promise<CategoryView | null> {
    const entity = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (entity === null) {
      return null;
    }
    entity.name = name;
    await this.categoriesRepository.save(entity);
    return this.entityToView(entity);
  }

  public async remove(id: string): Promise<void> {
    await this.categoriesRepository.delete(id);
  }

  public async countProductsByCategoryId(categoryId: string): Promise<number> {
    return this.productsRepository.count({
      where: { categoryId },
    });
  }

  private entityToView(entity: CategoryEntity): CategoryView {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
