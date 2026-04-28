import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../infrastructure/persistence/typeorm/entities/product.entity';
import { StoreEntity } from '../../../infrastructure/persistence/typeorm/entities/store.entity';
import { InventoryCatalogRepository } from '../application/ports/inventory-catalog.repository';

@Injectable()
export class InventoryCatalogRepositoryImpl implements InventoryCatalogRepository {
  public constructor(
    @InjectRepository(StoreEntity)
    private readonly storesRepository: Repository<StoreEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  public async storeExists(storeId: string): Promise<boolean> {
    return this.storesRepository.exists({
      where: { id: storeId },
    });
  }

  public async productExists(productId: string): Promise<boolean> {
    return this.productsRepository.exists({
      where: { id: productId },
    });
  }
}
