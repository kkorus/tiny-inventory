import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { JSX } from 'react';
import { createCategory, fetchCategory, updateCategory } from '../../api/categories.api';
import { toErrorMessage } from '../../api/error-message';
import type { CategoryPayload } from '../../api/types';
import { CategoryForm } from '../../components/forms/CategoryForm';
import { AsyncState } from '../../components/ui/AsyncState';
import { queryKeys } from '../../query/query-keys';

type CategoryEditPageProps = Readonly<{
  mode: 'create' | 'edit';
}>;

export function CategoryEditPage({ mode }: CategoryEditPageProps): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);
  const id = params.id ?? '';

  const categoryQuery = useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => fetchCategory(id),
    enabled: mode === 'edit' && id.length > 0,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/categories');
    },
    onError: (error: unknown) => {
      setApiError(toErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CategoryPayload) => updateCategory(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/categories');
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
            <Link to="/categories">Categories</Link>
            <span>/</span>
            <span>{mode === 'create' ? 'New' : 'Edit'}</span>
          </div>
          <h2>{mode === 'create' ? 'Create category' : 'Edit category'}</h2>
        </div>
        <Link to="/categories">
          <button type="button">← Back</button>
        </Link>
      </div>
      <AsyncState
        isLoading={categoryQuery.isLoading}
        errorMessage={
          categoryQuery.error ? toErrorMessage(categoryQuery.error) : null
        }
        isEmpty={false}
      >
        <CategoryForm
          initialValue={categoryQuery.data}
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
