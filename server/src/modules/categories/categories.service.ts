import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CATEGORY_REPOSITORY } from './application/ports/category.repository';
import { CategoryView } from './application/read-models/category-view.read-model';
import type { CategoryRepository } from './application/ports/category.repository';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { randomUUID } from 'node:crypto';
import { isUniqueViolation } from '../common/utils/is-unique-violation.util';

@Injectable()
export class CategoriesService {
  public constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoriesRepository: CategoryRepository,
  ) {}

  public async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const name = createCategoryDto.name.trim();
    if (name.length === 0) {
      throw new BadRequestException('Category name cannot be empty.');
    }

    try {
      const saved = await this.categoriesRepository.persist(randomUUID(), name);
      return this.toResponseDto(saved);
    } catch (error: unknown) {
      if (isUniqueViolation(error as { code?: string })) {
        throw new ConflictException('Category name already exists.');
      }
      throw error;
    }
  }

  public async findAll(): Promise<readonly CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findAll();
    return categories.map((category) => this.toResponseDto(category));
  }

  public async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findById(id);
    if (category === null) {
      throw new NotFoundException(`Category with id "${id}" was not found.`);
    }
    return this.toResponseDto(category);
  }

  public async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    if (
      updateCategoryDto.name === undefined ||
      updateCategoryDto.name === null
    ) {
      throw new BadRequestException('Provide a category name.');
    }
    const name = updateCategoryDto.name.trim();
    if (name.length === 0) {
      throw new BadRequestException('Category name cannot be empty.');
    }

    try {
      const updated = await this.categoriesRepository.updateName(id, name);
      if (updated === null) {
        throw new NotFoundException(`Category with id "${id}" was not found.`);
      }
      return this.toResponseDto(updated);
    } catch (error: unknown) {
      if (isUniqueViolation(error as { code?: string })) {
        throw new ConflictException('Category name already exists.');
      }
      throw error;
    }
  }

  public async remove(id: string): Promise<void> {
    const category = await this.categoriesRepository.findById(id);
    if (category === null) {
      throw new NotFoundException(`Category with id "${id}" was not found.`);
    }
    const productCount =
      await this.categoriesRepository.countProductsByCategoryId(id);
    if (productCount > 0) {
      throw new ConflictException(
        `Cannot delete category because ${productCount} product(s) are assigned to it.`,
      );
    }
    await this.categoriesRepository.remove(id);
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
