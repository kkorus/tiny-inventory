import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Central database wiring. Entity modules will be added in the next stage.
 * synchronize is dev-only; migrations will be introduced with real entities.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: Number(config.get<string>('DATABASE_PORT', '5432')),
        username: config.get<string>('DATABASE_USER', 'tiny'),
        password: config.get<string>('DATABASE_PASSWORD', 'tiny'),
        database: config.get<string>('DATABASE_NAME', 'tiny_inventory'),
        autoLoadEntities: true,
        synchronize: true,
        logging: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
  ],
})
export class DatabaseModule {}
