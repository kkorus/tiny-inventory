export type StoreProductView = Readonly<{
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  price: string;
  quantity: number;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}>;
