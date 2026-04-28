import { Test, TestingModule } from '@nestjs/testing';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from './application/ports/category.repository';
import { CategoryView } from './application/read-models/category-view.read-model';
import { CategoriesService } from './categories.service';

type CategoryRepositoryMock = {
  readonly [K in keyof CategoryRepository]: jest.Mock;
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: CategoryRepositoryMock;

  beforeEach(async () => {
    // given
    categoryRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CATEGORY_REPOSITORY,
          useValue: categoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('returns response DTOs from read model', async () => {
    // given
    const categoryView: CategoryView = {
      id: 'f9c53f68-6ea9-44e2-9150-b8f3ef91662f',
      name: 'Electronics',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };
    categoryRepository.findAll.mockResolvedValue([categoryView]);

    // when
    const result = await service.findAll();

    // then
    expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(categoryView.id);
    expect(result[0].name).toBe(categoryView.name);
    expect(result[0].createdAt).toEqual(categoryView.createdAt);
    expect(result[0].updatedAt).toEqual(categoryView.updatedAt);
  });
});
