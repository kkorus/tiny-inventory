import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { StoreProductEntity } from './store-product.entity';

@Entity({ name: 'products' })
@Unique('uq_products_sku', ['sku'])
@Index('idx_products_category_id', ['categoryId'])
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid', name: 'category_id' })
  public categoryId!: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  public category!: CategoryEntity;

  @Column({ type: 'varchar', length: 180 })
  public name!: string;

  @Column({ type: 'varchar', length: 80 })
  public sku!: string;

  @OneToMany(() => StoreProductEntity, (storeProduct) => storeProduct.product)
  public inventoryLines!: readonly StoreProductEntity[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  public updatedAt!: Date;
}
