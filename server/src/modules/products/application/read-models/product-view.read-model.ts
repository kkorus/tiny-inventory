export type ProductCategoryView = Readonly<{
  id: string;
  name: string;
}>;

export type ProductView = Readonly<{
  id: string;
  categoryId: string;
  name: string;
  sku: string;
  category: ProductCategoryView;
  createdAt: Date;
  updatedAt: Date;
}>;
