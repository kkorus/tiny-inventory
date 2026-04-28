import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { StoreEntity } from './store.entity';

@Entity({ name: 'store_products' })
@Unique('uq_store_products_store_id_product_id', ['storeId', 'productId'])
@Index('idx_store_products_store_id', ['storeId'])
@Index('idx_store_products_product_id', ['productId'])
@Index('idx_store_products_quantity', ['quantity'])
@Check('chk_store_products_quantity_non_negative', '"quantity" >= 0')
@Check(
  'chk_store_products_low_stock_threshold_non_negative',
  '"low_stock_threshold" >= 0',
)
@Check('chk_store_products_price_non_negative', '"price" >= 0')
export class StoreProductEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid', name: 'store_id' })
  public storeId!: string;

  @Column({ type: 'uuid', name: 'product_id' })
  public productId!: string;

  @ManyToOne(() => StoreEntity, (store) => store.inventoryLines, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'store_id' })
  public store!: StoreEntity;

  @ManyToOne(() => ProductEntity, (product) => product.inventoryLines, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  public product!: ProductEntity;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  public price!: string;

  @Column({ type: 'integer' })
  public quantity!: number;

  @Column({ type: 'integer', name: 'low_stock_threshold' })
  public lowStockThreshold!: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  public updatedAt!: Date;
}
