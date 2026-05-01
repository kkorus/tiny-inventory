import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { CategoryEditPage } from '../pages/categories/CategoryEditPage';
import { CategoryListPage } from '../pages/categories/CategoryListPage';
import { ProductEditPage } from '../pages/products/ProductEditPage';
import { ProductListPage } from '../pages/products/ProductListPage';
import { LowStockReportPage } from '../pages/reports/LowStockReportPage';
import { StoreProductEditPage } from '../pages/store-products/StoreProductEditPage';
import { StoreProductsPage } from '../pages/store-products/StoreProductsPage';
import { StoreDetailPage } from '../pages/stores/StoreDetailPage';
import { StoreEditPage } from '../pages/stores/StoreEditPage';
import { StoreListPage } from '../pages/stores/StoreListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/new', element: <ProductEditPage mode="create" /> },
      { path: 'products/:id/edit', element: <ProductEditPage mode="edit" /> },
      { path: 'categories', element: <CategoryListPage /> },
      { path: 'categories/new', element: <CategoryEditPage mode="create" /> },
      {
        path: 'categories/:id/edit',
        element: <CategoryEditPage mode="edit" />,
      },
      { path: 'stores', element: <StoreListPage /> },
      { path: 'stores/new', element: <StoreEditPage mode="create" /> },
      { path: 'stores/:id/edit', element: <StoreEditPage mode="edit" /> },
      { path: 'stores/:id', element: <StoreDetailPage /> },
      { path: 'store-products', element: <StoreProductsPage /> },
      { path: 'reports', element: <LowStockReportPage /> },
      {
        path: 'store-products/:id/edit',
        element: <StoreProductEditPage />,
      },
    ],
  },
]);
