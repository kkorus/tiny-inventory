import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { JSX } from 'react';
import { toErrorMessage } from '../../api/error-message';
import { createStore, fetchStore, updateStore } from '../../api/stores.api';
import type { StorePayload } from '../../api/types';
import { StoreForm } from '../../components/forms/StoreForm';
import { AsyncState } from '../../components/ui/AsyncState';
import { queryKeys } from '../../query/query-keys';

type StoreEditPageProps = Readonly<{
  mode: 'create' | 'edit';
}>;

export function StoreEditPage({ mode }: StoreEditPageProps): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);
  const id = params.id ?? '';

  const storeQuery = useQuery({
    queryKey: queryKeys.store(id),
    queryFn: () => fetchStore(id),
    enabled: mode === 'edit' && id.length > 0,
  });

  const createMutation = useMutation({
    mutationFn: (payload: StorePayload) => createStore(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['stores'] });
      navigate('/stores');
    },
    onError: (error: unknown) => {
      setApiError(toErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: StorePayload) => updateStore(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['stores'] });
      navigate('/stores');
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
            <Link to="/stores">Stores</Link>
            <span>/</span>
            <span>{mode === 'create' ? 'New' : 'Edit'}</span>
          </div>
          <h2>{mode === 'create' ? 'Create store' : 'Edit store'}</h2>
        </div>
        <Link to="/stores">
          <button type="button">← Back</button>
        </Link>
      </div>
      <AsyncState
        isLoading={storeQuery.isLoading}
        errorMessage={storeQuery.error ? toErrorMessage(storeQuery.error) : null}
        isEmpty={false}
      >
        <StoreForm
          initialValue={storeQuery.data}
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
