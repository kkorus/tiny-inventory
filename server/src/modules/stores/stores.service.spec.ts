import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  STORE_REPOSITORY,
  StoreRepository,
} from './application/ports/store.repository';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoresService } from './stores.service';

type StoreRepositoryMock = {
  readonly [K in keyof StoreRepository]: jest.Mock;
};

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

    // when
    const result = await service.create(dto);

    // then
    expect(storeRepository.insert).toHaveBeenCalledTimes(1);
    expect(storeRepository.findViewById).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: expect.any(String) as string,
      name: dto.name,
      address: dto.address,
      createdAt: expect.any(Date) as Date,
      updatedAt: expect.any(Date) as Date,
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
