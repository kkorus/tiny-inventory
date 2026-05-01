import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { JSX } from 'react';
import type { Category, CategoryPayload } from '../../api/types';

const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryFormProps = Readonly<{
  initialValue?: Category;
  submitLabel: string;
  onSubmit: (payload: CategoryPayload) => Promise<void>;
  isSubmittingExternally: boolean;
  apiError: string | null;
}>;

export function CategoryForm({
  initialValue,
  submitLabel,
  onSubmit,
  isSubmittingExternally,
  apiError,
}: CategoryFormProps): JSX.Element {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialValue?.name ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);
  const isSubmitting = form.formState.isSubmitting || isSubmittingExternally;

  return (
    <form className="form-card" onSubmit={(event) => void handleSubmit(event)}>
      {apiError && (
        <div className="error-box">
          <span>⚠️</span>
          {apiError}
        </div>
      )}

      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" {...form.register('name')} placeholder="e.g. Electronics" />
        {form.formState.errors.name && (
          <span className="field-error">{form.formState.errors.name.message}</span>
        )}
      </div>

      <div className="form-actions">
        <button className="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
