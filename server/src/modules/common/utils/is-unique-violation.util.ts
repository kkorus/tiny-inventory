type DatabaseErrorWithCode = Readonly<{
  code?: string;
}>;

export function isUniqueViolation(error: DatabaseErrorWithCode): boolean {
  return error.code === '23505';
}
