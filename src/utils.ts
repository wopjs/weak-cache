export const isObject = (value: any): value is object =>
  value !== null && typeof value === "object";

const keys = new WeakMap<object, symbol>();

export type PrimitiveKey =
  | undefined
  | null
  | boolean
  | string
  | number
  | symbol;

export const getPrimitiveKey = (key: any): PrimitiveKey =>
  isObject(key)
    ? (keys.has(key) ? keys : keys.set(key, Symbol())).get(key)
    : key;
