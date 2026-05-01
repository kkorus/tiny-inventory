import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import type { JSX } from 'react';
import { toErrorMessage } from '../../api/error-message';
import { fetchProducts } from '../../api/products.api';
import { fetchStore, fetchStores } from '../../api/stores.api';
import {
  createStoreProduct,
  deleteStoreProduct,
  fetchStoreProducts,
} from '../../api/store-products.api';
import type { StoreProductPayload } from '../../api/types';
import { StoreProductForm } from '../../components/forms/StoreProductForm';
import { AsyncState } from '../../components/ui/AsyncState';
import { queryKeys } from '../../query/query-keys';

const PAGE_LIMIT = 20;

export function StoreDetailPage(): JSX.Element {
  const params = useParams();
  const id = params.id ?? '';
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const storeQuery = useQuery({
    queryKey: queryKeys.store(id),
    queryFn: () => fetchStore(id),
    enabled: id.length > 0,
  });

  const inventoryQuery = useQuery({
    queryKey: queryKeys.storeProducts(`store:${id}:page:${page}`),
    queryFn: () => fetchStoreProducts({ storeId: id, page, limit: PAGE_LIMIT }),
    enabled: id.length > 0,
  });

  const storesQuery = useQuery({
    queryKey: queryKeys.stores(1, 100),
    queryFn: () => fetchStores(1, 100),
  });

  const productsQuery = useQuery({
    queryKey: queryKeys.products(1, 100),
    queryFn: () => fetchProducts(1, 100),
  });

  const createInventoryLineMutation = useMutation({
    mutationFn: (payload: StoreProductPayload) => createStoreProduct(payload),
    onSuccess: async () => {
      setActionError(null);
      await queryClient.invalidateQueries({ queryKey: ['store-products'] });
    },
    onError: (error: unknown) => {
      setActionError(toErrorMessage(error));
    },
  });

  const deleteInventoryLineMutation = useMutation({
    mutationFn: (storeProductId: string) => deleteStoreProduct(storeProductId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['store-products'] });
    },
    onError: (error: unknown) => {
      setActionError(toErrorMessage(error));
    },
  });

  const store = storeQuery.data;
  const totalPages = inventoryQuery.data
    ? Math.ceil(inventoryQuery.data.meta.total / inventoryQuery.data.meta.limit)
    : 1;

  return (
    <section className="stack-lg">
      <div className="page-header">
        <div>
          <div className="breadcrumb" style={{ marginBottom: '0.375rem' }}>
            <Link to="/stores">Stores</Link>
            <span>/</span>
            <span>{store?.name ?? '…'}</span>
          </div>
          <h2>Store details</h2>
        </div>
        <div className="row">
          <Link to="/stores">
            <button type="button">← Back</button>
          </Link>
          {id && (
            <Link to={`/stores/${id}/edit`}>
              <button type="button">Edit store</button>
            </Link>
          )}
        </div>
      </div>

      <AsyncState
        isLoading={storeQuery.isLoading}
        errorMessage={storeQuery.error ? toErrorMessage(storeQuery.error) : null}
        isEmpty={false}
      >
        {store && (
          <div className="store-info-card">
            <div className="store-avatar">🏪</div>
            <div>
              <div className="store-info-name">{store.name}</div>
              <div className="store-info-address">{store.address}</div>
            </div>
          </div>
        )}
      </AsyncState>

      {actionError && (
        <div className="error-box">
          <span>⚠️</span>
          {actionError}
        </div>
      )}

      <div>
        <div className="section-header">
          <h3>Assign product to this store</h3>
        </div>
        <AsyncState
          isLoading={productsQuery.isLoading || storesQuery.isLoading}
          errorMessage={
            productsQuery.error || storesQuery.error
              ? toErrorMessage(productsQuery.error ?? storesQuery.error)
              : null
          }
          isEmpty={false}
        >
          <StoreProductForm
            stores={storesQuery.data?.data ?? []}
            products={productsQuery.data?.data ?? []}
            presetStoreId={id}
            submitLabel="Assign product"
            apiError={actionError}
            isSubmittingExternally={createInventoryLineMutation.isPending}
            onSubmit={async (payload) => {
              await createInventoryLineMutation.mutateAsync(payload);
            }}
          />
        </AsyncState>
      </div>

      <div>
        <div className="section-header">
          <h3>Inventory lines</h3>
          {inventoryQuery.data && (
            <span className="badge badge-gray">{inventoryQuery.data.meta.total} items</span>
          )}
        </div>
        <AsyncState
          isLoading={inventoryQuery.isLoading}
          errorMessage={inventoryQuery.error ? toErrorMessage(inventoryQuery.error) : null}
          isEmpty={!inventoryQuery.data || inventoryQuery.data.data.length === 0}
          emptyMessage="No inventory lines"
          emptyDescription="Assign your first product above to see it here."
          emptyIcon="📋"
        >
          <div className="stack">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Low-stock at</th>
                  <th style={{ width: '8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryQuery.data?.data.map((line) => {
                  const isLow = line.quantity <= line.lowStockThreshold;
                  return (
                    <tr key={line.id}>
                      <td style={{ fontWeight: 500 }}>{line.productName}</td>
                      <td>
                        <span className="badge badge-blue font-mono">{line.sku}</span>
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
                            onClick={() => deleteInventoryLineMutation.mutate(line.id)}
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
            {inventoryQuery.data && (
              <div className="pagination">
                <button
                  type="button"
                  disabled={inventoryQuery.data.meta.page <= 1}
                  onClick={() => setPage((v) => v - 1)}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {inventoryQuery.data.meta.page} of {totalPages} &mdash;{' '}
                  {inventoryQuery.data.meta.total} record{inventoryQuery.data.meta.total !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  disabled={!inventoryQuery.data.meta.hasNext}
                  onClick={() => setPage((v) => v + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </AsyncState>
      </div>
    </section>
  );
}
