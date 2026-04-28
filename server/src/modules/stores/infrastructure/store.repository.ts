import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreEntity } from '../../../infrastructure/persistence/typeorm/entities/store.entity';
import { PaginatedResponse } from '../../common/types/paginated-response.type';
import { StoreView } from '../application/read-models/store-view.read-model';
import { StoreRepository } from '../application/ports/store.repository';
import { Store } from '../domain/store.aggregate';
import { StoreMapper } from './store.mapper';

@Injectable()
export class StoreRepositoryImpl implements StoreRepository {
  public constructor(
    @InjectRepository(StoreEntity)
    private readonly storesRepository: Repository<StoreEntity>,
  ) {}

  public async insert(store: Store): Promise<void> {
    const payload = StoreMapper.toPersistence(store);
    await this.storesRepository.insert(payload);
  }

  public async findById(id: string): Promise<Store | null> {
    const entity = await this.storesRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!entity) {
      return null;
    }
    return StoreMapper.toDomain(entity);
  }

  public async save(store: Store): Promise<void> {
    const payload = StoreMapper.toPersistence(store);
    await this.storesRepository.update({ id: payload.id }, payload);
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.storesRepository.delete({ id });
    return Boolean(result.affected);
  }

  public async findList(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StoreView>> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.storesRepository.findAndCount({
      order: { createdAt: 'DESC', id: 'ASC' },
      skip,
      take: limit,
    });
    return {
      data: data.map((store) => this.toView(store)),
      meta: {
        total,
        page,
        limit,
        hasNext: page * limit < total,
      },
    };
  }

  public async findViewById(id: string): Promise<StoreView | null> {
    const entity = await this.storesRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    return this.toView(entity);
  }

  private toView(entity: StoreEntity): StoreView {
    return {
      id: entity.id,
      name: entity.name,
      address: entity.address,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
