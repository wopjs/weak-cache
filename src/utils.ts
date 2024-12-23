export const isObject = (value: unknown): value is object =>
  value !== null && (typeof value === "object" || typeof value === "function");

const keys = new WeakMap<object, symbol>();

export type PrimitiveKey = boolean | null | number | string | symbol | undefined;

export const getPrimitiveKey = (key: unknown): PrimitiveKey =>
  isObject(key) ? (keys.has(key) ? keys : keys.set(key, Symbol())).get(key) : (key as PrimitiveKey);
