import 'dotenv/config';
import { DataSource, Repository } from 'typeorm';
import appDataSource from '../../../database/data-source';
import { CategoryEntity } from '../typeorm/entities/category.entity';
import { ProductEntity } from '../typeorm/entities/product.entity';
import { StoreEntity } from '../typeorm/entities/store.entity';
import { StoreProductEntity } from '../typeorm/entities/store-product.entity';

type SeedCategory = Readonly<{ name: string }>;
type SeedProduct = Readonly<{ name: string; sku: string; category: string }>;
type SeedStore = Readonly<{ name: string; address: string }>;
type SeedInventory = Readonly<{
  store: string;
  sku: string;
  price: string;
  quantity: number;
  lowStockThreshold: number;
}>;

const categoriesSeed: readonly SeedCategory[] = [
  { name: 'Electronics' },
  { name: 'Household' },
  { name: 'Grocery' },
  { name: 'Office' },
];

const productsSeed: readonly SeedProduct[] = [
  { name: 'Wireless Mouse', sku: 'ELEC-MOUSE-001', category: 'Electronics' },
  {
    name: 'Mechanical Keyboard',
    sku: 'ELEC-KEYB-001',
    category: 'Electronics',
  },
  { name: 'LED Desk Lamp', sku: 'HOUSE-LAMP-001', category: 'Household' },
  {
    name: 'All-Purpose Cleaner',
    sku: 'HOUSE-CLEAN-001',
    category: 'Household',
  },
  { name: 'Ground Coffee 500g', sku: 'GROC-COFFEE-001', category: 'Grocery' },
  { name: 'A4 Printer Paper', sku: 'OFF-PAPER-001', category: 'Office' },
];

const storesSeed: readonly SeedStore[] = [
  { name: 'Downtown Store', address: '15 Main St, Springfield' },
  { name: 'Riverside Store', address: '28 River Rd, Springfield' },
  { name: 'Airport Store', address: 'Terminal 1, Springfield Airport' },
];

const inventorySeed: readonly SeedInventory[] = [
  {
    store: 'Downtown Store',
    sku: 'ELEC-MOUSE-001',
    price: '24.99',
    quantity: 25,
    lowStockThreshold: 8,
  },
  {
    store: 'Riverside Store',
    sku: 'ELEC-MOUSE-001',
    price: '26.50',
    quantity: 7,
    lowStockThreshold: 10,
  },
  {
    store: 'Airport Store',
    sku: 'ELEC-MOUSE-001',
    price: '29.90',
    quantity: 3,
    lowStockThreshold: 5,
  },
  {
    store: 'Downtown Store',
    sku: 'ELEC-KEYB-001',
    price: '89.00',
    quantity: 11,
    lowStockThreshold: 5,
  },
  {
    store: 'Riverside Store',
    sku: 'HOUSE-LAMP-001',
    price: '34.50',
    quantity: 4,
    lowStockThreshold: 6,
  },
  {
    store: 'Airport Store',
    sku: 'GROC-COFFEE-001',
    price: '12.20',
    quantity: 14,
    lowStockThreshold: 7,
  },
  {
    store: 'Downtown Store',
    sku: 'OFF-PAPER-001',
    price: '6.90',
    quantity: 40,
    lowStockThreshold: 12,
  },
];

async function upsertCategories(
  repository: Repository<CategoryEntity>,
): Promise<void> {
  await repository.upsert(
    categoriesSeed.map((category) => ({ name: category.name })),
    ['name'],
  );
}

async function upsertProducts(
  repository: Repository<ProductEntity>,
  categoryRepository: Repository<CategoryEntity>,
): Promise<void> {
  const categories = await categoryRepository.find();
  const categoriesByName = new Map(
    categories.map((category) => [category.name, category] as const),
  );

  const products = productsSeed.map((productSeed) => {
    const category = categoriesByName.get(productSeed.category);
    if (!category) {
      throw new Error(`Missing category for product seed: ${productSeed.name}`);
    }

    return {
      name: productSeed.name,
      sku: productSeed.sku,
      categoryId: category.id,
    };
  });

  await repository.upsert(products, ['sku']);
}

async function upsertStores(
  repository: Repository<StoreEntity>,
): Promise<void> {
  await repository.upsert(
    storesSeed.map((store) => ({
      name: store.name,
      address: store.address,
    })),
    ['name'],
  );
}

async function upsertInventory(
  repository: Repository<StoreProductEntity>,
  storeRepository: Repository<StoreEntity>,
  productRepository: Repository<ProductEntity>,
): Promise<void> {
  const stores = await storeRepository.find();
  const storesByName = new Map(
    stores.map((store) => [store.name, store] as const),
  );
  const products = await productRepository.find();
  const productsBySku = new Map(
    products.map((product) => [product.sku, product] as const),
  );

  const inventoryRows = inventorySeed.map((inventory) => {
    const store = storesByName.get(inventory.store);
    if (!store) {
      throw new Error(`Missing store for inventory seed: ${inventory.store}`);
    }

    const product = productsBySku.get(inventory.sku);
    if (!product) {
      throw new Error(`Missing product for inventory seed: ${inventory.sku}`);
    }

    return {
      storeId: store.id,
      productId: product.id,
      price: inventory.price,
      quantity: inventory.quantity,
      lowStockThreshold: inventory.lowStockThreshold,
    };
  });

  await repository.upsert(inventoryRows, ['storeId', 'productId']);
}

async function runSeed(dataSource: DataSource): Promise<void> {
  const categoryRepository = dataSource.getRepository(CategoryEntity);
  const productRepository = dataSource.getRepository(ProductEntity);
  const storeRepository = dataSource.getRepository(StoreEntity);
  const storeProductRepository = dataSource.getRepository(StoreProductEntity);

  await upsertCategories(categoryRepository);
  await upsertProducts(productRepository, categoryRepository);
  await upsertStores(storeRepository);
  await upsertInventory(
    storeProductRepository,
    storeRepository,
    productRepository,
  );
}

async function bootstrapSeed(): Promise<void> {
  await appDataSource.initialize();
  try {
    await runSeed(appDataSource);

    console.log('Seed completed successfully.');
  } finally {
    await appDataSource.destroy();
  }
}

void bootstrapSeed();
