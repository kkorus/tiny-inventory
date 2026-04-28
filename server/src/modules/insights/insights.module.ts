import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProductEntity } from '../../infrastructure/persistence/typeorm/entities/store-product.entity';
import { INSIGHTS_REPOSITORY } from './application/ports/insights.repository';
import { InsightsRepositoryImpl } from './infrastructure/insights.repository';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProductEntity])],
  controllers: [InsightsController],
  providers: [
    InsightsService,
    {
      provide: INSIGHTS_REPOSITORY,
      useClass: InsightsRepositoryImpl,
    },
  ],
})
export class InsightsModule {}
