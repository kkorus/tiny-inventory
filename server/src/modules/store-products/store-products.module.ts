import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../infrastructure/persistence/typeorm/entities/product.entity';
import { StoreProductEntity } from '../../infrastructure/persistence/typeorm/entities/store-product.entity';
import { StoreEntity } from '../../infrastructure/persistence/typeorm/entities/store.entity';
import { INVENTORY_CATALOG_REPOSITORY } from './application/ports/inventory-catalog.repository';
import { STORE_PRODUCT_REPOSITORY } from './application/ports/store-product.repository';
import { InventoryCatalogRepositoryImpl } from './infrastructure/inventory-catalog.repository';
import { StoreProductRepositoryImpl } from './infrastructure/store-product.repository';
import { StoreProductsController } from './store-products.controller';
import { StoreProductsService } from './store-products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreProductEntity, StoreEntity, ProductEntity]),
  ],
  controllers: [StoreProductsController],
  providers: [
    StoreProductsService,
    {
      provide: STORE_PRODUCT_REPOSITORY,
      useClass: StoreProductRepositoryImpl,
    },
    {
      provide: INVENTORY_CATALOG_REPOSITORY,
      useClass: InventoryCatalogRepositoryImpl,
    },
  ],
  exports: [StoreProductsService],
})
export class StoreProductsModule {}
