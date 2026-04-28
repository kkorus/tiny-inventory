import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../infrastructure/persistence/typeorm/entities/category.entity';
import { ProductEntity } from '../../infrastructure/persistence/typeorm/entities/product.entity';
import { PRODUCT_CATALOG_REPOSITORY } from './application/ports/product-catalog.repository';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository';
import { ProductCatalogRepositoryImpl } from './infrastructure/product-catalog.repository';
import { ProductRepositoryImpl } from './infrastructure/product.repository';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: PRODUCT_CATALOG_REPOSITORY,
      useClass: ProductCatalogRepositoryImpl,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
