import type { PaginatedMeta } from '../../api/types';
import type { JSX } from 'react';

type PaginationControlsProps = Readonly<{
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
}>;

export function PaginationControls({
  meta,
  onPageChange,
}: PaginationControlsProps): JSX.Element {
  const totalPages = Math.ceil(meta.total / Math.max(1, meta.limit));

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        ← Previous
      </button>
      <span className="pagination-info">
        Page {meta.page} of {totalPages || 1} &mdash; {meta.total} record{meta.total !== 1 ? 's' : ''}
      </span>
      <button
        type="button"
        disabled={!meta.hasNext}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
