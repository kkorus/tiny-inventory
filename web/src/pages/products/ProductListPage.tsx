import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { JSX } from 'react';
import { deleteProduct, fetchProducts } from '../../api/products.api';
import { toErrorMessage } from '../../api/error-message';
import { AsyncState } from '../../components/ui/AsyncState';
import { PaginationControls } from '../../components/ui/PaginationControls';
import { queryKeys } from '../../query/query-keys';

export function ProductListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: queryKeys.products(page, limit),
    queryFn: () => fetchProducts(page, limit),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: unknown) => {
      setActionError(toErrorMessage(error));
    },
  });

  return (
    <section className="stack">
      <div className="page-header">
        <h2>Products</h2>
        <Link to="/products/new">
          <button className="primary" type="button">
            + New product
          </button>
        </Link>
      </div>

      {actionError && (
        <div className="error-box">
          <span>⚠️</span>
          {actionError}
        </div>
      )}

      <AsyncState
        isLoading={productsQuery.isLoading}
        errorMessage={productsQuery.error ? toErrorMessage(productsQuery.error) : null}
        isEmpty={!productsQuery.data || productsQuery.data.data.length === 0}
        emptyMessage="No products yet"
        emptyDescription="Add your first product to start building the catalog."
        emptyIcon="📦"
      >
        <div className="stack">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th style={{ width: '10rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsQuery.data?.data.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>
                    <span className="badge badge-blue font-mono">{product.sku}</span>
                  </td>
                  <td>
                    <span className="badge badge-gray">{product.category.name}</span>
                  </td>
                  <td>
                    <div className="row">
                      <Link className="action-link" to={`/products/${product.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="action-link-danger"
                        type="button"
                        onClick={() => {
                          setActionError(null);
                          deleteMutation.mutate(product.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productsQuery.data && (
            <PaginationControls
                meta={productsQuery.data.meta}
                onPageChange={setPage}
                onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
              />
          )}
        </div>
      </AsyncState>
    </section>
  );
}
