import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toErrorMessage } from '../../api/error-message';
import { deleteStore, fetchStores } from '../../api/stores.api';
import { AsyncState } from '../../components/ui/AsyncState';
import { PaginationControls } from '../../components/ui/PaginationControls';
import { queryKeys } from '../../query/query-keys';
import type { JSX } from 'react';

const PAGE_LIMIT = 20;

export function StoreListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const storesQuery = useQuery({
    queryKey: queryKeys.stores(page, PAGE_LIMIT),
    queryFn: () => fetchStores(page, PAGE_LIMIT),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStore(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
    onError: (error: unknown) => {
      setActionError(toErrorMessage(error));
    },
  });

  return (
    <section className="stack">
      <div className="page-header">
        <h2>Stores</h2>
        <Link to="/stores/new">
          <button className="primary" type="button">
            + New store
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
        isLoading={storesQuery.isLoading}
        errorMessage={storesQuery.error ? toErrorMessage(storesQuery.error) : null}
        isEmpty={!storesQuery.data || storesQuery.data.data.length === 0}
        emptyMessage="No stores yet"
        emptyDescription="Create your first store to start managing inventory."
        emptyIcon="🏪"
      >
        <div className="stack">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th style={{ width: '12rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {storesQuery.data?.data.map((store) => (
                <tr key={store.id}>
                  <td style={{ fontWeight: 500 }}>{store.name}</td>
                  <td className="text-muted">{store.address}</td>
                  <td>
                    <div className="row">
                      <Link className="action-link" to={`/stores/${store.id}`}>
                        Details
                      </Link>
                      <Link className="action-link" to={`/stores/${store.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="action-link-danger"
                        type="button"
                        onClick={() => {
                          setActionError(null);
                          deleteMutation.mutate(store.id);
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
          {storesQuery.data && (
            <PaginationControls meta={storesQuery.data.meta} onPageChange={setPage} />
          )}
        </div>
      </AsyncState>
    </section>
  );
}
