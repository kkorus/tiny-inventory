import { DomainValidationError } from '../../../common/domain/errors/domain-validation.error';
import { Brand } from '../../../common/domain/types/brand.type';

export type ProductId = Brand<string, 'ProductId'>;
export type CategoryId = Brand<string, 'CategoryId'>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ensureUuid(value: string, fieldName: string): void {
  if (!UUID_REGEX.test(value)) {
    throw new DomainValidationError(`Invalid UUID in "${fieldName}".`);
  }
}

export function toProductId(value: string): ProductId {
  ensureUuid(value, 'productId');
  return value as ProductId;
}

export function toCategoryId(value: string): CategoryId {
  ensureUuid(value, 'categoryId');
  return value as CategoryId;
}
