import { CategoryView } from '../read-models/category-view.read-model';

export interface CategoryRepository {
  findAll(): Promise<readonly CategoryView[]>;
  findById(id: string): Promise<CategoryView | null>;
  persist(id: string, name: string): Promise<CategoryView>;
  updateName(id: string, name: string): Promise<CategoryView | null>;
  remove(id: string): Promise<void>;
  countProductsByCategoryId(categoryId: string): Promise<number>;
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');
