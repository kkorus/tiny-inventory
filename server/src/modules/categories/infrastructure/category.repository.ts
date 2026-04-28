import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../infrastructure/persistence/typeorm/entities/category.entity';
import { CategoryRepository } from '../application/ports/category.repository';
import { CategoryView } from '../application/read-models/category-view.read-model';

@Injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
  public constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
  ) {}

  public async findAll(): Promise<readonly CategoryView[]> {
    const categories = await this.categoriesRepository.find({
      order: { name: 'ASC' },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }
}
