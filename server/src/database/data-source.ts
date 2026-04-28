import 'dotenv/config';
import { DataSource } from 'typeorm';
import { CategoryEntity } from '../infrastructure/persistence/typeorm/entities/category.entity';
import { ProductEntity } from '../infrastructure/persistence/typeorm/entities/product.entity';
import { StoreEntity } from '../infrastructure/persistence/typeorm/entities/store.entity';
import { StoreProductEntity } from '../infrastructure/persistence/typeorm/entities/store-product.entity';

const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? '5432'),
  username: process.env.DATABASE_USER ?? 'tiny',
  password: process.env.DATABASE_PASSWORD ?? 'tiny',
  database: process.env.DATABASE_NAME ?? 'tiny_inventory',
  entities: [CategoryEntity, ProductEntity, StoreEntity, StoreProductEntity],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
});

export default appDataSource;
