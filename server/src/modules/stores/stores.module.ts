import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from '../../infrastructure/persistence/typeorm/entities/store.entity';
import { STORE_REPOSITORY } from './application/ports/store.repository';
import { StoreRepositoryImpl } from './infrastructure/store.repository';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity])],
  controllers: [StoresController],
  providers: [
    StoresService,
    {
      provide: STORE_REPOSITORY,
      useClass: StoreRepositoryImpl,
    },
  ],
  exports: [StoresService],
})
export class StoresModule {}
