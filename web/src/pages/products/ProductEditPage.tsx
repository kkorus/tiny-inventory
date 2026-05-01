import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { JSX } from 'react';
import { fetchCategories } from '../../api/categories.api';
import { toErrorMessage } from '../../api/error-message';
import {
  createProduct,
  fetchProduct,
  updateProduct,
} from '../../api/products.api';
import type { ProductPayload } from '../../api/types';
import { ProductForm } from '../../components/forms/ProductForm';
import { AsyncState } from '../../components/ui/AsyncState';
import { queryKeys } from '../../query/query-keys';

type ProductEditPageProps = Readonly<{
  mode: 'create' | 'edit';
}>;

export function ProductEditPage({ mode }: ProductEditPageProps): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);
  const id = params.id ?? '';

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });

  const productQuery = useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => fetchProduct(id),
    enabled: mode === 'edit' && id.length > 0,
  });

  const createMutation = useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    },
    onError: (error: unknown) => {
      setApiError(toErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ProductPayload) => updateProduct(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    },
    onError: (error: unknown) => {
      setApiError(toErrorMessage(error));
    },
  });

  const isLoading = categoriesQuery.isLoading || productQuery.isLoading;
  const pageError =
    categoriesQuery.error || productQuery.error
      ? toErrorMessage(categoriesQuery.error ?? productQuery.error)
      : null;

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <div className="breadcrumb" style={{ marginBottom: '0.375rem' }}>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>{mode === 'create' ? 'New' : 'Edit'}</span>
          </div>
          <h2>{mode === 'create' ? 'Create product' : 'Edit product'}</h2>
        </div>
        <Link to="/products">
          <button type="button">← Back</button>
        </Link>
      </div>
      <AsyncState
        isLoading={isLoading}
        errorMessage={pageError}
        isEmpty={false}
      >
        <ProductForm
          categories={categoriesQuery.data ?? []}
          initialValue={productQuery.data}
          submitLabel={mode === 'create' ? 'Create' : 'Save'}
          apiError={apiError}
          isSubmittingExternally={
            createMutation.isPending || updateMutation.isPending
          }
          onSubmit={async (payload) => {
            setApiError(null);
            if (mode === 'create') {
              await createMutation.mutateAsync(payload);
              return;
            }
            await updateMutation.mutateAsync(payload);
          }}
        />
      </AsyncState>
    </section>
  );
}
