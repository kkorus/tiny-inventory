import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/types/paginated-response.type';
import {
  isForeignKeyViolation,
  isUniqueViolation,
} from '../common/utils/is-unique-violation.util';
import { STORE_REPOSITORY } from './application/ports/store.repository';
import { StoreView } from './application/read-models/store-view.read-model';
import type { StoreRepository } from './application/ports/store.repository';
import { DomainValidationError } from '../common/domain/errors/domain-validation.error';
import { Store } from './domain/store.aggregate';
import { StoreAddress } from './domain/value-objects/store-address.vo';
import { StoreName } from './domain/value-objects/store-name.vo';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class StoresService {
  public constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storesRepository: StoreRepository,
  ) {}

  public async create(
    createStoreDto: CreateStoreDto,
  ): Promise<StoreResponseDto> {
    try {
      const now = new Date();
      const store = Store.create({
        id: randomUUID(),
        name: StoreName.create(createStoreDto.name),
        address: StoreAddress.create(createStoreDto.address),
        createdAt: now,
        updatedAt: now,
      });
      await this.storesRepository.insert(store);
      return store.toSnapshot();
    } catch (error) {
      if (error instanceof DomainValidationError) {
        throw new BadRequestException(error.message);
      }
      if (isUniqueViolation(error as { code?: string })) {
        throw new ConflictException('Store name already exists.');
      }
      throw error;
    }
  }

  public async findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<StoreResponseDto>> {
    const response = await this.storesRepository.findList(
      pagination.page,
      pagination.limit,
    );
    return {
      data: response.data.map((store) => this.toResponseDto(store)),
      meta: response.meta,
    };
  }

  public async findOne(id: string): Promise<StoreResponseDto> {
    const store = await this.storesRepository.findViewById(id);
    if (!store) {
      throw new NotFoundException(`Store with id "${id}" was not found.`);
    }
    return this.toResponseDto(store);
  }

  public async update(
    id: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesRepository.findById(id);
    if (!store) {
      throw new NotFoundException(`Store with id "${id}" was not found.`);
    }

    try {
      store.update({
        name: updateStoreDto.name
          ? StoreName.create(updateStoreDto.name)
          : undefined,
        address: updateStoreDto.address
          ? StoreAddress.create(updateStoreDto.address)
          : undefined,
      });
      await this.storesRepository.save(store);
      return store.toSnapshot();
    } catch (error) {
      if (error instanceof DomainValidationError) {
        throw new BadRequestException(error.message);
      }
      if (isUniqueViolation(error as { code?: string })) {
        throw new ConflictException('Store name already exists.');
      }
      throw error;
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const isDeleted = await this.storesRepository.deleteById(id);
      if (!isDeleted) {
        throw new NotFoundException(`Store with id "${id}" was not found.`);
      }
    } catch (error) {
      if (isForeignKeyViolation(error as { code?: string })) {
        throw new ConflictException(
          'Store has inventory lines and cannot be deleted.',
        );
      }
      throw error;
    }
  }

  private toResponseDto(view: StoreView): StoreResponseDto {
    return {
      id: view.id,
      name: view.name,
      address: view.address,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
    };
  }
}
