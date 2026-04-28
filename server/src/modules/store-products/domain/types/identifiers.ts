import { DomainValidationError } from '../errors/domain-validation.error';
import { Brand } from './brand.type';

export type StoreProductId = Brand<string, 'StoreProductId'>;
export type StoreId = Brand<string, 'StoreId'>;
export type ProductId = Brand<string, 'ProductId'>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ensureUuid(value: string, fieldName: string): void {
  if (!UUID_REGEX.test(value)) {
    throw new DomainValidationError(`Invalid UUID in "${fieldName}".`);
  }
}

export function toStoreProductId(value: string): StoreProductId {
  ensureUuid(value, 'storeProductId');
  return value as StoreProductId;
}

export function toStoreId(value: string): StoreId {
  ensureUuid(value, 'storeId');
  return value as StoreId;
}

export function toProductId(value: string): ProductId {
  ensureUuid(value, 'productId');
  return value as ProductId;
}
