type DatabaseErrorWithCode = Readonly<{
  code?: string;
}>;

export function isUniqueViolation(error: DatabaseErrorWithCode): boolean {
  return error.code === '23505';
}

export function isForeignKeyViolation(error: DatabaseErrorWithCode): boolean {
  return error.code === '23503';
}
