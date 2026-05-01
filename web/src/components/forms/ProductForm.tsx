import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { JSX } from 'react';
import type { Category, Product, ProductPayload } from '../../api/types';

const skuRegex = /^[A-Z0-9-]+$/;

const productSchema = z.object({
  name: z.string().trim().min(1).max(180),
  sku: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .transform((val) => val.toUpperCase())
    .pipe(
      z
        .string()
        .regex(skuRegex, 'SKU can contain uppercase letters, digits, and dashes.'),
    ),
  categoryId: z.string().uuid(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type ProductFormProps = Readonly<{
  categories: readonly Category[];
  initialValue?: Product;
  submitLabel: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  isSubmittingExternally: boolean;
  apiError: string | null;
}>;

export function ProductForm({
  categories,
  initialValue,
  submitLabel,
  onSubmit,
  isSubmittingExternally,
  apiError,
}: ProductFormProps): JSX.Element {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialValue?.name ?? '',
      sku: initialValue?.sku ?? '',
      categoryId: initialValue?.categoryId ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

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
        <label htmlFor="pf-name">Name</label>
        <input id="pf-name" {...form.register('name')} placeholder="e.g. Wireless Mouse" />
        {form.formState.errors.name && (
          <span className="field-error">{form.formState.errors.name.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="pf-sku">SKU</label>
        <input
          id="pf-sku"
          {...form.register('sku')}
          placeholder="e.g. ELEC-MOUSE-001"
          style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
        />
        <span className="field-hint">Uppercase letters, digits, and dashes only.</span>
        {form.formState.errors.sku && (
          <span className="field-error">{form.formState.errors.sku.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="pf-category">Category</label>
        <select id="pf-category" {...form.register('categoryId')}>
          <option value="">Select category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {form.formState.errors.categoryId && (
          <span className="field-error">{form.formState.errors.categoryId.message}</span>
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
