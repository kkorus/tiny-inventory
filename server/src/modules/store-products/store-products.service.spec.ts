import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  INVENTORY_CATALOG_REPOSITORY,
  InventoryCatalogRepository,
} from './application/ports/inventory-catalog.repository';
import {
  STORE_PRODUCT_REPOSITORY,
  StoreProductRepository,
} from './application/ports/store-product.repository';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { StoreProductViewDto } from './dto/store-product-view.dto';
import { StoreProductsService } from './store-products.service';

type StoreProductRepositoryMock = {
  readonly [K in keyof StoreProductRepository]: jest.Mock;
};

type InventoryCatalogRepositoryMock = {
  readonly [K in keyof InventoryCatalogRepository]: jest.Mock;
};

const exampleStoreProductView: StoreProductViewDto = {
  id: '8e29fcb5-a640-4bc8-bec1-c66a8bc4062f',
  storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
  storeName: 'Main Street Store',
  productId: '06459f12-d156-4410-8e85-28d7f4b6628b',
  productName: 'Wireless Mouse',
  sku: 'ELEC-MOUSE-001',
  categoryId: '9d4c1125-7c3a-4b8c-bf3d-d760eb4f17f6',
  categoryName: 'Electronics',
  price: '24.99',
  quantity: 10,
  lowStockThreshold: 3,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const createStoreProductDto: CreateStoreProductDto = {
  storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
  productId: '06459f12-d156-4410-8e85-28d7f4b6628b',
  price: '24.99',
  quantity: 10,
  lowStockThreshold: 3,
};

describe('StoreProductsService', () => {
  let service: StoreProductsService;
  let storeProductRepository: StoreProductRepositoryMock;
  let inventoryCatalogRepository: InventoryCatalogRepositoryMock;

  beforeEach(async () => {
    // given
    storeProductRepository = {
      insert: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findViewById: jest.fn(),
      findViews: jest.fn(),
    };

    inventoryCatalogRepository = {
      storeExists: jest.fn(),
      productExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreProductsService,
        {
          provide: STORE_PRODUCT_REPOSITORY,
          useValue: storeProductRepository,
        },
        {
          provide: INVENTORY_CATALOG_REPOSITORY,
          useValue: inventoryCatalogRepository,
        },
      ],
    }).compile();

    service = module.get<StoreProductsService>(StoreProductsService);
  });

  it('creates inventory line when store and product exist', async () => {
    // given
    inventoryCatalogRepository.storeExists.mockResolvedValue(true);
    inventoryCatalogRepository.productExists.mockResolvedValue(true);
    storeProductRepository.findViewById.mockResolvedValue(
      exampleStoreProductView,
    );

    // when
    const result = await service.create(createStoreProductDto);

    // then
    expect(storeProductRepository.insert).toHaveBeenCalledTimes(1);
    expect(result).toEqual(exampleStoreProductView);
  });

  it('throws NotFoundException when store does not exist', async () => {
    // given
    inventoryCatalogRepository.storeExists.mockResolvedValue(false);

    // when
    const action = service.create(createStoreProductDto);

    // then
    await expect(action).rejects.toBeInstanceOf(NotFoundException);
    expect(storeProductRepository.insert).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when product does not exist', async () => {
    // given
    inventoryCatalogRepository.storeExists.mockResolvedValue(true);
    inventoryCatalogRepository.productExists.mockResolvedValue(false);

    // when
    const action = service.create(createStoreProductDto);

    // then
    await expect(action).rejects.toBeInstanceOf(NotFoundException);
    expect(storeProductRepository.insert).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when updating unknown inventory line', async () => {
    // given
    storeProductRepository.findById.mockResolvedValue(null);

    // when
    const action = service.update('8e29fcb5-a640-4bc8-bec1-c66a8bc4062f', {
      quantity: 5,
    });

    // then
    await expect(action).rejects.toBeInstanceOf(NotFoundException);
    expect(storeProductRepository.save).not.toHaveBeenCalled();
  });
});
