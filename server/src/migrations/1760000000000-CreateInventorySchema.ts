import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableCheck,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateInventorySchema1760000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createUniqueConstraint(
      'categories',
      new TableUnique({
        name: 'uq_categories_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'stores',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '160',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createUniqueConstraint(
      'stores',
      new TableUnique({
        name: 'uq_stores_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '180',
            isNullable: false,
          },
          {
            name: 'sku',
            type: 'varchar',
            length: '80',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createUniqueConstraint(
      'products',
      new TableUnique({
        name: 'uq_products_sku',
        columnNames: ['sku'],
      }),
    );
    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'idx_products_category_id',
        columnNames: ['category_id'],
      }),
    );
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'fk_products_category_id',
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'store_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'store_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'low_stock_threshold',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createUniqueConstraint(
      'store_products',
      new TableUnique({
        name: 'uq_store_products_store_id_product_id',
        columnNames: ['store_id', 'product_id'],
      }),
    );
    await queryRunner.createIndex(
      'store_products',
      new TableIndex({
        name: 'idx_store_products_store_id',
        columnNames: ['store_id'],
      }),
    );
    await queryRunner.createIndex(
      'store_products',
      new TableIndex({
        name: 'idx_store_products_product_id',
        columnNames: ['product_id'],
      }),
    );
    await queryRunner.createIndex(
      'store_products',
      new TableIndex({
        name: 'idx_store_products_quantity',
        columnNames: ['quantity'],
      }),
    );
    await queryRunner.createCheckConstraint(
      'store_products',
      new TableCheck({
        name: 'chk_store_products_price_non_negative',
        expression: '"price" >= 0',
      }),
    );
    await queryRunner.createCheckConstraint(
      'store_products',
      new TableCheck({
        name: 'chk_store_products_quantity_non_negative',
        expression: '"quantity" >= 0',
      }),
    );
    await queryRunner.createCheckConstraint(
      'store_products',
      new TableCheck({
        name: 'chk_store_products_low_stock_threshold_non_negative',
        expression: '"low_stock_threshold" >= 0',
      }),
    );
    await queryRunner.createForeignKeys('store_products', [
      new TableForeignKey({
        name: 'fk_store_products_store_id',
        columnNames: ['store_id'],
        referencedTableName: 'stores',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
      new TableForeignKey({
        name: 'fk_store_products_product_id',
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('store_products', true);
    await queryRunner.dropTable('products', true);
    await queryRunner.dropTable('stores', true);
    await queryRunner.dropTable('categories', true);
    await queryRunner.query('DROP EXTENSION IF EXISTS "pgcrypto";');
  }
}
