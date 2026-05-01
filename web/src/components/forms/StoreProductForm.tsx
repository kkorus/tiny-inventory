import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { JSX } from 'react';
import type {
  Product,
  Store,
  StoreProduct,
  StoreProductPayload,
} from '../../api/types';

const storeProductSchema = z.object({
  storeId: z.string().uuid(),
  productId: z.string().uuid(),
  price: z
    .string()
    .trim()
    .min(1)
    .max(16)
    .regex(/^\d+(\.\d{1,2})?$/, 'Use decimal format, for example: 12.50'),
  quantity: z.number().int().min(0).max(1_000_000),
  lowStockThreshold: z.number().int().min(0).max(1_000_000),
});

type StoreProductFormValues = z.infer<typeof storeProductSchema>;

type StoreProductFormProps = Readonly<{
  stores: readonly Store[];
  products: readonly Product[];
  initialValue?: StoreProduct;
  presetStoreId?: string;
  submitLabel: string;
  apiError: string | null;
  isSubmittingExternally: boolean;
  onSubmit: (payload: StoreProductPayload) => Promise<void>;
}>;

export function StoreProductForm({
  stores,
  products,
  initialValue,
  presetStoreId,
  submitLabel,
  apiError,
  isSubmittingExternally,
  onSubmit,
}: StoreProductFormProps): JSX.Element {
  const form = useForm<StoreProductFormValues>({
    resolver: zodResolver(storeProductSchema),
    defaultValues: {
      storeId: presetStoreId ?? initialValue?.storeId ?? '',
      productId: initialValue?.productId ?? '',
      price: initialValue?.price ?? '0.00',
      quantity: initialValue?.quantity ?? 0,
      lowStockThreshold: initialValue?.lowStockThreshold ?? 0,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      storeId: values.storeId,
      productId: values.productId,
      price: values.price,
      quantity: values.quantity,
      lowStockThreshold: values.lowStockThreshold,
    });
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
        <label htmlFor="spf-store">Store</label>
        <select id="spf-store" {...form.register('storeId')} disabled={Boolean(presetStoreId)}>
          <option value="">Select store…</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        {form.formState.errors.storeId && (
          <span className="field-error">{form.formState.errors.storeId.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="spf-product">Product</label>
        <select id="spf-product" {...form.register('productId')}>
          <option value="">Select product…</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.sku})
            </option>
          ))}
        </select>
        {form.formState.errors.productId && (
          <span className="field-error">{form.formState.errors.productId.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="spf-price">Price</label>
        <input id="spf-price" {...form.register('price')} placeholder="e.g. 12.50" />
        <span className="field-hint">Decimal format with up to 2 decimal places.</span>
        {form.formState.errors.price && (
          <span className="field-error">{form.formState.errors.price.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="spf-qty">Quantity</label>
        <input
          id="spf-qty"
          type="number"
          min={0}
          {...form.register('quantity', { valueAsNumber: true })}
        />
        {form.formState.errors.quantity && (
          <span className="field-error">{form.formState.errors.quantity.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="spf-threshold">Low-stock threshold</label>
        <input
          id="spf-threshold"
          type="number"
          min={0}
          {...form.register('lowStockThreshold', { valueAsNumber: true })}
        />
        <span className="field-hint">Alert when quantity falls at or below this value.</span>
        {form.formState.errors.lowStockThreshold && (
          <span className="field-error">{form.formState.errors.lowStockThreshold.message}</span>
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
