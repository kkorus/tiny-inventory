import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../infrastructure/persistence/typeorm/entities/category.entity';
import { ProductEntity } from '../../infrastructure/persistence/typeorm/entities/product.entity';
import { CATEGORY_REPOSITORY } from './application/ports/category.repository';
import { CategoryRepositoryImpl } from './infrastructure/category.repository';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl,
    },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
