import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  STORE_REPOSITORY,
  StoreRepository,
} from './application/ports/store.repository';
import { StoreView } from './application/read-models/store-view.read-model';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoresService } from './stores.service';

type StoreRepositoryMock = {
  readonly [K in keyof StoreRepository]: jest.Mock;
};

function createStoreView(): StoreView {
  return {
    id: 'f3253d00-d34d-4cf7-97c4-2e1f703e4e76',
    name: 'Downtown Store',
    address: '15 Main St, Springfield',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
}

describe('StoresService', () => {
  let service: StoresService;
  let storeRepository: StoreRepositoryMock;

  beforeEach(async () => {
    // given
    storeRepository = {
      insert: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findList: jest.fn(),
      findViewById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: STORE_REPOSITORY,
          useValue: storeRepository,
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  it('creates store using domain and repository port', async () => {
    // given
    const dto: CreateStoreDto = {
      name: 'Downtown Store',
      address: '15 Main St, Springfield',
    };
    const storeView = createStoreView();
    storeRepository.findViewById.mockResolvedValue(storeView);

    // when
    const result = await service.create(dto);

    // then
    expect(storeRepository.insert).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: storeView.id,
      name: storeView.name,
      address: storeView.address,
      createdAt: storeView.createdAt,
      updatedAt: storeView.updatedAt,
    });
  });

  it('throws NotFoundException for unknown store in update', async () => {
    // given
    storeRepository.findById.mockResolvedValue(null);

    // when
    const action = service.update('f3253d00-d34d-4cf7-97c4-2e1f703e4e76', {
      name: 'Uptown Store',
    });

    // then
    await expect(action).rejects.toBeInstanceOf(NotFoundException);
    expect(storeRepository.save).not.toHaveBeenCalled();
  });
});
