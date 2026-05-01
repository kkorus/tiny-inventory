import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { JSX } from 'react';
import { fetchCategories } from '../../api/categories.api';
import { toErrorMessage } from '../../api/error-message';
import { fetchStores } from '../../api/stores.api';
import { deleteStoreProduct, fetchStoreProducts } from '../../api/store-products.api';
import type { StoreProductFilters } from '../../api/types';
import { AsyncState } from '../../components/ui/AsyncState';
import { PaginationControls } from '../../components/ui/PaginationControls';
import { queryKeys } from '../../query/query-keys';

const DEFAULT_LIMIT = 20;

function filtersToKey(filters: StoreProductFilters): string {
  return JSON.stringify({
    ...filters,
    page: filters.page ?? 1,
    limit: filters.limit ?? DEFAULT_LIMIT,
  });
}

export function StoreProductsPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StoreProductFilters>({
    page: 1,
    limit: DEFAULT_LIMIT,
  });

  const paramsKey = useMemo(() => filtersToKey(filters), [filters]);

  const linesQuery = useQuery({
    queryKey: queryKeys.storeProducts(paramsKey),
    queryFn: () => fetchStoreProducts(filters),
  });

  const storesQuery = useQuery({
    queryKey: queryKeys.stores(1, 100),
    queryFn: () => fetchStores(1, 100),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStoreProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['store-products'] });
    },
    onError: (error: unknown) => {
      setActionError(toErrorMessage(error));
    },
  });

  return (
    <section className="stack">
      <div className="page-header">
        <h2>Store products</h2>
        {linesQuery.data && (
          <span className="badge badge-gray">{linesQuery.data.meta.total} lines</span>
        )}
      </div>

      <div className="filter-panel">
        <div className="filter-panel-title">Filters</div>
        <div className="filter-grid">
          <div className="filter-field">
            <label htmlFor="filter-store">Store</label>
            <select
              id="filter-store"
              value={filters.storeId ?? ''}
              onChange={(event) =>
                setFilters((f) => ({
                  ...f,
                  storeId: event.target.value || undefined,
                  page: 1,
                }))
              }
            >
              <option value="">All stores</option>
              {storesQuery.data?.data.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="filter-category">Category</label>
            <select
              id="filter-category"
              value={filters.categoryId ?? ''}
              onChange={(event) =>
                setFilters((f) => ({
                  ...f,
                  categoryId: event.target.value || undefined,
                  page: 1,
                }))
              }
            >
              <option value="">All categories</option>
              {categoriesQuery.data?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="filter-sku">SKU</label>
            <input
              id="filter-sku"
              value={filters.sku ?? ''}
              placeholder="e.g. ELEC-001"
              style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
              onChange={(event) =>
                setFilters((f) => ({
                  ...f,
                  sku: event.target.value.toUpperCase() || undefined,
                  page: 1,
                }))
              }
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-min-price">Min price</label>
            <input
              id="filter-min-price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.minPrice ?? ''}
              onChange={(event) =>
                setFilters((f) => ({
                  ...f,
                  minPrice: event.target.value === '' ? undefined : Number(event.target.value),
                  page: 1,
                }))
              }
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-max-price">Max price</label>
            <input
              id="filter-max-price"
              type="number"
              step="0.01"
              placeholder="9999.00"
              value={filters.maxPrice ?? ''}
              onChange={(event) =>
                setFilters((f) => ({
                  ...f,
                  maxPrice: event.target.value === '' ? undefined : Number(event.target.value),
                  page: 1,
                }))
              }
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-min-qty">Min qty</label>
            <input
              id="filter-min-qty"
              type="number"
              placeholder="0"
              value={filters.minQuantity ?? ''}
              onChange={(event) =>
                setFilters((f) => ({
                  ...f,
                  minQuantity: event.target.value === '' ? undefined : Number(event.target.value),
                  page: 1,
                }))
              }
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-max-qty">Max qty</label>
            <input
              id="filter-max-qty"
              type="number"
              placeholder="9999"
              value={filters.maxQuantity ?? ''}
              onChange={(event) =>
                setFilters((f) => ({
                  ...f,
                  maxQuantity: event.target.value === '' ? undefined : Number(event.target.value),
                  page: 1,
                }))
              }
            />
          </div>
        </div>
      </div>

      {actionError && (
        <div className="error-box">
          <span>⚠️</span>
          {actionError}
        </div>
      )}

      <AsyncState
        isLoading={linesQuery.isLoading}
        errorMessage={linesQuery.error ? toErrorMessage(linesQuery.error) : null}
        isEmpty={!linesQuery.data || linesQuery.data.data.length === 0}
        emptyMessage="No inventory lines match your filters"
        emptyDescription="Try adjusting the filters above."
        emptyIcon="🔍"
      >
        <div className="stack">
          <table>
            <thead>
              <tr>
                <th>Store</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Threshold</th>
                <th style={{ width: '8rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {linesQuery.data?.data.map((line) => {
                const isLow = line.quantity <= line.lowStockThreshold;
                return (
                  <tr key={line.id}>
                    <td style={{ fontWeight: 500 }}>{line.storeName}</td>
                    <td>{line.productName}</td>
                    <td>
                      <span className="badge badge-blue font-mono">{line.sku}</span>
                    </td>
                    <td>
                      <span className="badge badge-gray">{line.categoryName}</span>
                    </td>
                    <td>{line.price}</td>
                    <td>
                      <span className={`badge ${isLow ? 'badge-red' : 'badge-green'}`}>
                        {line.quantity}
                      </span>
                    </td>
                    <td className="text-muted">{line.lowStockThreshold}</td>
                    <td>
                      <div className="row">
                        <Link className="action-link" to={`/store-products/${line.id}/edit`}>
                          Edit
                        </Link>
                        <button
                          className="action-link-danger"
                          type="button"
                          onClick={() => {
                            setActionError(null);
                            deleteMutation.mutate(line.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {linesQuery.data && (
            <PaginationControls
              meta={linesQuery.data.meta}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
              onLimitChange={(limit) => setFilters((f) => ({ ...f, limit, page: 1 }))}
            />
          )}
        </div>
      </AsyncState>
    </section>
  );
}
