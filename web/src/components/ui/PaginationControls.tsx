import type { PaginatedMeta } from '../../api/types';
import type { JSX } from 'react';

const LIMIT_OPTIONS = [5, 10, 20, 50] as const;

type PaginationControlsProps = Readonly<{
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}>;

export function PaginationControls({
  meta,
  onPageChange,
  onLimitChange,
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
      {onLimitChange && (
        <select
          className="pagination-limit-select"
          value={meta.limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          aria-label="Results per page"
        >
          {LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt} per page
            </option>
          ))}
        </select>
      )}
      <span className="pagination-info">
        Page {meta.page} of {totalPages || 1} &mdash; {meta.total} record
        {meta.total !== 1 ? 's' : ''}
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
