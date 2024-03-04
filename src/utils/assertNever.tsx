export function assertNever(value: never): never {
  throw new Error(`value should not exist ${value}`);
}
