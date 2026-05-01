export type Brand<TValue, TName extends string> = TValue & {
  readonly __brand: TName;
};
