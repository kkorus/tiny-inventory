import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryNameCaseInsensitiveUnique1760000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE categories DROP CONSTRAINT IF EXISTS "uq_categories_name"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_categories_name_ci" ON categories (LOWER(name))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "uq_categories_name_ci"`);
    await queryRunner.query(
      `ALTER TABLE categories ADD CONSTRAINT "uq_categories_name" UNIQUE (name)`,
    );
  }
}
