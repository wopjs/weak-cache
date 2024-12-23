const keys = new WeakMap<object, symbol>();

export type PrimitiveKey = boolean | number | string | symbol;

export const getPrimitiveKey = (key: unknown): PrimitiveKey =>
  key === null || (typeof key !== "object" && typeof key !== "function")
    ? (key as PrimitiveKey)
    : (keys.has(key) ? keys : keys.set(key, Symbol())).get(key)!;
