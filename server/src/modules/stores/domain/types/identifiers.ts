import { DomainValidationError } from '../../../common/domain/errors/domain-validation.error';
import { Brand } from '../../../common/domain/types/brand.type';

export type StoreId = Brand<string, 'StoreId'>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function toStoreId(value: string): StoreId {
  if (!UUID_REGEX.test(value)) {
    throw new DomainValidationError('Invalid UUID in "storeId".');
  }
  return value as StoreId;
}
