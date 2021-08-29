// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function expectNever<T extends never>(_val: T): never {
  throw new Error(`Expected never !`);
}
