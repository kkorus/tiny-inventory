import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { JSX } from 'react';
import { toErrorMessage } from '../../api/error-message';
import { fetchProducts } from '../../api/products.api';
import { fetchStores } from '../../api/stores.api';
import {
  fetchStoreProduct,
  updateStoreProduct,
} from '../../api/store-products.api';
import type { StoreProductPayload } from '../../api/types';
import { StoreProductForm } from '../../components/forms/StoreProductForm';
import { AsyncState } from '../../components/ui/AsyncState';
import { queryKeys } from '../../query/query-keys';

export function StoreProductEditPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);
  const id = params.id ?? '';

  const lineQuery = useQuery({
    queryKey: queryKeys.storeProduct(id),
    queryFn: () => fetchStoreProduct(id),
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

  const updateMutation = useMutation({
    mutationFn: (payload: StoreProductPayload) => updateStoreProduct(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['store-products'] });
      navigate('/store-products');
    },
    onError: (error: unknown) => {
      setApiError(toErrorMessage(error));
    },
  });

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <div className="breadcrumb" style={{ marginBottom: '0.375rem' }}>
            <Link to="/store-products">Store products</Link>
            <span>/</span>
            <span>Edit</span>
          </div>
          <h2>Edit inventory line</h2>
        </div>
        <Link to="/store-products">
          <button type="button">← Back</button>
        </Link>
      </div>
      <AsyncState
        isLoading={lineQuery.isLoading || storesQuery.isLoading || productsQuery.isLoading}
        errorMessage={
          lineQuery.error || storesQuery.error || productsQuery.error
            ? toErrorMessage(lineQuery.error ?? storesQuery.error ?? productsQuery.error)
            : null
        }
        isEmpty={false}
      >
        <StoreProductForm
          stores={storesQuery.data?.data ?? []}
          products={productsQuery.data?.data ?? []}
          initialValue={lineQuery.data}
          submitLabel="Save"
          apiError={apiError}
          isSubmittingExternally={updateMutation.isPending}
          onSubmit={async (payload) => {
            setApiError(null);
            await updateMutation.mutateAsync(payload);
          }}
        />
      </AsyncState>
    </section>
  );
}
