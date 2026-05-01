import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { JSX } from 'react';
import { fetchCategories } from '../../api/categories.api';
import { toErrorMessage } from '../../api/error-message';
import { fetchLowStockInsights } from '../../api/insights.api';
import { fetchStores } from '../../api/stores.api';
import type { LowStockInsightsFilters } from '../../api/types';
import { AsyncState } from '../../components/ui/AsyncState';
import { queryKeys } from '../../query/query-keys';

function filtersToKey(filters: LowStockInsightsFilters): string {
  return JSON.stringify({ ...filters });
}

export function LowStockReportPage(): JSX.Element {
  const [filters, setFilters] = useState<LowStockInsightsFilters>({});
  const paramsKey = useMemo(() => filtersToKey(filters), [filters]);

  const storesQuery = useQuery({
    queryKey: queryKeys.stores(1, 100),
    queryFn: () => fetchStores(1, 100),
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });

  const insightsQuery = useQuery({
    queryKey: queryKeys.insightsLowStock(paramsKey),
    queryFn: () => fetchLowStockInsights(filters),
  });

  const filtersReady = !storesQuery.isLoading && !categoriesQuery.isLoading;
  const filtersError =
    storesQuery.error || categoriesQuery.error
      ? toErrorMessage(storesQuery.error ?? categoriesQuery.error)
      : null;

  return (
    <section className="stack">
      <div className="page-header">
        <h2>Reports</h2>
        <span className="badge badge-amber">Low stock</span>
      </div>
      <p className="muted">
        Inventory lines where quantity is at or below the low-stock threshold.
      </p>

      <div className="filter-panel">
        <div className="filter-panel-title">Filters</div>
        <AsyncState
          isLoading={!filtersReady}
          errorMessage={filtersError}
          isEmpty={false}
        >
          <div className="filter-grid">
            <div className="filter-field">
              <label htmlFor="low-stock-filter-store">Store</label>
              <select
                id="low-stock-filter-store"
                value={filters.storeId ?? ''}
                onChange={(event) =>
                  setFilters((f) => ({
                    ...f,
                    storeId: event.target.value || undefined,
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
              <label htmlFor="low-stock-filter-category">Category</label>
              <select
                id="low-stock-filter-category"
                value={filters.categoryId ?? ''}
                onChange={(event) =>
                  setFilters((f) => ({
                    ...f,
                    categoryId: event.target.value || undefined,
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
          </div>
        </AsyncState>
      </div>

      <AsyncState
        isLoading={insightsQuery.isLoading}
        errorMessage={insightsQuery.error ? toErrorMessage(insightsQuery.error) : null}
        isEmpty={false}
      >
        {insightsQuery.data && (
          <div className="stack">
            <div className="row" style={{ alignItems: 'stretch' }}>
              <div className="card-sm" style={{ flex: '1 1 12rem', minWidth: '10rem' }}>
                <div className="muted text-xs">Total low-stock lines</div>
                <div className="card-title" style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
                  {insightsQuery.data.summary.totalLowStock}
                </div>
              </div>
              <div className="card-sm" style={{ flex: '2 1 18rem', minWidth: '14rem' }}>
                <div className="muted text-xs" style={{ marginBottom: '0.5rem' }}>
                  By store
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Store</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insightsQuery.data.summary.byStore.map((row) => (
                      <tr key={row.storeId}>
                        <td>{row.storeName}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-sm" style={{ flex: '2 1 18rem', minWidth: '14rem' }}>
                <div className="muted text-xs" style={{ marginBottom: '0.5rem' }}>
                  By category
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insightsQuery.data.summary.byCategory.map((row) => (
                      <tr key={row.categoryId}>
                        <td>{row.categoryName}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {insightsQuery.data.data.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✓</div>
                <p className="empty-state-title">No low-stock lines</p>
                <p className="empty-state-desc">
                  Nothing matches the current filters, or all inventory is above threshold.
                </p>
              </div>
            ) : (
              <div className="stack">
                <div className="section-header">
                  <h3>Details</h3>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Store</th>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Threshold</th>
                      <th style={{ width: '5rem' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {insightsQuery.data.data.map((line) => {
                      const isAtOrBelow = line.quantity <= line.lowStockThreshold;
                      return (
                        <tr key={line.storeProductId}>
                          <td style={{ fontWeight: 500 }}>{line.storeName}</td>
                          <td>{line.productName}</td>
                          <td>
                            <span className="badge badge-blue font-mono">{line.sku}</span>
                          </td>
                          <td>
                            <span className="badge badge-gray">{line.categoryName}</span>
                          </td>
                          <td>
                            <span className={`badge ${isAtOrBelow ? 'badge-red' : 'badge-green'}`}>
                              {line.quantity}
                            </span>
                          </td>
                          <td className="text-muted">{line.lowStockThreshold}</td>
                          <td>
                            <Link
                              className="action-link"
                              to={`/store-products/${line.storeProductId}/edit`}
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </AsyncState>
    </section>
  );
}
