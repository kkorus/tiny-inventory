import { CategoryView } from '../read-models/category-view.read-model';

export interface CategoryRepository {
  findAll(): Promise<readonly CategoryView[]>;
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');
