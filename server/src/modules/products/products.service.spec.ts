import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PRODUCT_CATALOG_REPOSITORY,
  ProductCatalogRepository,
} from './application/ports/product-catalog.repository';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from './application/ports/product.repository';
import { ProductView } from './application/read-models/product-view.read-model';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

type ProductRepositoryMock = {
  readonly [K in keyof ProductRepository]: jest.Mock;
};

type ProductCatalogRepositoryMock = {
  readonly [K in keyof ProductCatalogRepository]: jest.Mock;
};

function createProductView(): ProductView {
  return {
    id: '7ddd4f82-69d8-46bc-b0a2-0fe53f3f7d9e',
    categoryId: 'f9c53f68-6ea9-44e2-9150-b8f3ef91662f',
    name: 'Wireless Mouse',
    sku: 'ELEC-MOUSE-001',
    category: {
      id: 'f9c53f68-6ea9-44e2-9150-b8f3ef91662f',
      name: 'Electronics',
    },
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
}

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: ProductRepositoryMock;
  let productCatalogRepository: ProductCatalogRepositoryMock;

  beforeEach(async () => {
    // given
    productRepository = {
      insert: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findList: jest.fn(),
      findViewById: jest.fn(),
    };
    productCatalogRepository = {
      categoryExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: productRepository,
        },
        {
          provide: PRODUCT_CATALOG_REPOSITORY,
          useValue: productCatalogRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('creates product when category exists', async () => {
    // given
    const dto: CreateProductDto = {
      categoryId: 'f9c53f68-6ea9-44e2-9150-b8f3ef91662f',
      name: 'Wireless Mouse',
      sku: 'ELEC-MOUSE-001',
    };
    const productView = createProductView();
    productCatalogRepository.categoryExists.mockResolvedValue(true);
    productRepository.findViewById.mockResolvedValue(productView);

    // when
    const result = await service.create(dto);

    // then
    expect(productCatalogRepository.categoryExists).toHaveBeenCalledTimes(1);
    expect(productCatalogRepository.categoryExists).toHaveBeenCalledWith(
      dto.categoryId,
    );
    expect(productRepository.insert).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: productView.id,
      categoryId: productView.categoryId,
      name: productView.name,
      sku: productView.sku,
      category: productView.category,
      createdAt: productView.createdAt,
      updatedAt: productView.updatedAt,
    });
  });

  it('throws NotFoundException when category does not exist', async () => {
    // given
    const dto: CreateProductDto = {
      categoryId: 'f9c53f68-6ea9-44e2-9150-b8f3ef91662f',
      name: 'Wireless Mouse',
      sku: 'ELEC-MOUSE-001',
    };
    productCatalogRepository.categoryExists.mockResolvedValue(false);

    // when
    const action = service.create(dto);

    // then
    await expect(action).rejects.toBeInstanceOf(NotFoundException);
    expect(productRepository.insert).not.toHaveBeenCalled();
  });
});
