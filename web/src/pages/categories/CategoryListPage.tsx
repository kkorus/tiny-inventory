import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { JSX } from 'react';
import { deleteCategory, fetchCategories } from '../../api/categories.api';
import { toErrorMessage } from '../../api/error-message';
import { AsyncState } from '../../components/ui/AsyncState';
import { queryKeys } from '../../query/query-keys';

export function CategoryListPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => fetchCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: unknown) => {
      setActionError(toErrorMessage(error));
    },
  });

  return (
    <section className="stack">
      <div className="page-header">
        <h2>Categories</h2>
        <Link to="/categories/new">
          <button className="primary" type="button">
            + New category
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
        isLoading={categoriesQuery.isLoading}
        errorMessage={categoriesQuery.error ? toErrorMessage(categoriesQuery.error) : null}
        isEmpty={!categoriesQuery.data || categoriesQuery.data.length === 0}
        emptyMessage="No categories yet"
        emptyDescription="Add a category before assigning products to it."
        emptyIcon="📁"
      >
        <div className="stack">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th style={{ width: '10rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesQuery.data?.map((category) => (
                <tr key={category.id}>
                  <td style={{ fontWeight: 500 }}>{category.name}</td>
                  <td className="text-muted">
                    {new Date(category.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <div className="row">
                      <Link className="action-link" to={`/categories/${category.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="action-link-danger"
                        type="button"
                        onClick={() => {
                          setActionError(null);
                          deleteMutation.mutate(category.id);
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
        </div>
      </AsyncState>
    </section>
  );
}
