import type { ReactNode } from 'react';
import type { JSX } from 'react';

type AsyncStateProps = Readonly<{
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  children: ReactNode;
}>;

export function AsyncState({
  isLoading,
  errorMessage,
  isEmpty,
  emptyMessage,
  emptyDescription,
  emptyIcon = '📭',
  children,
}: AsyncStateProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="spinner-wrap">
        <span className="spinner" />
        Loading…
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div className="error-box">
        <span>⚠️</span>
        {errorMessage}
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">{emptyIcon}</div>
        <p className="empty-state-title">{emptyMessage ?? 'No records found'}</p>
        {emptyDescription && (
          <p className="empty-state-desc">{emptyDescription}</p>
        )}
      </div>
    );
  }
  return <>{children}</>;
}
