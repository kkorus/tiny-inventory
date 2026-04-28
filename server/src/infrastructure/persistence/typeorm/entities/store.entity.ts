import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { StoreProductEntity } from './store-product.entity';

@Entity({ name: 'stores' })
@Unique('uq_stores_name', ['name'])
export class StoreEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 160 })
  public name!: string;

  @Column({ type: 'varchar', length: 255 })
  public address!: string;

  @OneToMany(() => StoreProductEntity, (storeProduct) => storeProduct.store)
  public inventoryLines!: readonly StoreProductEntity[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  public updatedAt!: Date;
}
