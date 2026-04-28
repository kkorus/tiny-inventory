import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { InsightsModule } from './modules/insights/insights.module';
import { ProductsModule } from './modules/products/products.module';
import { StoreProductsModule } from './modules/store-products/store-products.module';
import { StoresModule } from './modules/stores/stores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    HealthModule,
    StoresModule,
    CategoriesModule,
    ProductsModule,
    StoreProductsModule,
    InsightsModule,
  ],
})
export class AppModule {}
