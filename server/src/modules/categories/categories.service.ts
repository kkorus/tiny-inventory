import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from './application/ports/category.repository';
import { CategoryView } from './application/read-models/category-view.read-model';
import type { CategoryRepository } from './application/ports/category.repository';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  public constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoriesRepository: CategoryRepository,
  ) {}

  public async findAll(): Promise<readonly CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findAll();
    return categories.map((category) => this.toResponseDto(category));
  }

  private toResponseDto(view: CategoryView): CategoryResponseDto {
    return {
      id: view.id,
      name: view.name,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
    };
  }
}
