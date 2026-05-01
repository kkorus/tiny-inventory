import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { JSX } from 'react';
import type { Store, StorePayload } from '../../api/types';

const storeSchema = z.object({
  name: z.string().trim().min(1).max(160),
  address: z.string().trim().min(1).max(255),
});

type StoreFormValues = z.infer<typeof storeSchema>;

type StoreFormProps = Readonly<{
  initialValue?: Store;
  submitLabel: string;
  onSubmit: (payload: StorePayload) => Promise<void>;
  isSubmittingExternally: boolean;
  apiError: string | null;
}>;

export function StoreForm({
  initialValue,
  submitLabel,
  onSubmit,
  isSubmittingExternally,
  apiError,
}: StoreFormProps): JSX.Element {
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: initialValue?.name ?? '',
      address: initialValue?.address ?? '',
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
        <label htmlFor="sf-name">Name</label>
        <input id="sf-name" {...form.register('name')} placeholder="e.g. Downtown Branch" />
        {form.formState.errors.name && (
          <span className="field-error">{form.formState.errors.name.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="sf-address">Address</label>
        <input id="sf-address" {...form.register('address')} placeholder="e.g. 123 Main St, Warsaw" />
        {form.formState.errors.address && (
          <span className="field-error">{form.formState.errors.address.message}</span>
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
