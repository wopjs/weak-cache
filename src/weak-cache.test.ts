import { describe, expect, it, vi } from "vitest";

import { WeakCache } from "./index";

const wait = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

const waitGC = async () => {
  await wait();
  gc!();
  await wait();
};

describe("WeakCache", () => {
  it("should cache primitive key with object value", () => {
    const cache = new WeakCache();
    const key = "key";
    const value = { value: "value" };

    cache.set(key, value);

    expect(cache.has(key)).toEqual(true);
    expect(cache.get(key)).toEqual(value);

    cache.delete(key);

    expect(cache.has(key)).toEqual(false);
    expect(cache.get(key)).toBeUndefined();
  });

  it("should cache object key with object value", () => {
    const cache = new WeakCache();
    const key = { key: "key" };
    const value = { value: "value" };

    cache.set(key, value);

    expect(cache.has(key)).toEqual(true);
    expect(cache.get(key)).toEqual(value);

    cache.delete(key);
    cache.delete("not-exist");

    expect(cache.has(key)).toEqual(false);
    expect(cache.get(key)).toBeUndefined();
  });

  it("should cache plain object key with object value", () => {
    const cache = new WeakCache();
    const key = Object.create(null);
    key.key = "key";
    const value = { value: "value" };

    cache.set(key, value);

    expect(cache.has(key)).toEqual(true);
    expect(cache.get(key)).toEqual(value);

    cache.delete(key);
    cache.delete("not-exist");

    expect(cache.has(key)).toEqual(false);
    expect(cache.get(key)).toBeUndefined();
  });

  it("should clear cache", () => {
    const cache = new WeakCache();
    const key = "key";
    const value = { value: "value" };
    const objectKey = { key: "key" };
    const objectValue = { value: "value" };

    cache.set(key, value);
    cache.set(objectKey, objectValue);

    expect(cache.has(key)).toEqual(true);
    expect(cache.get(key)).toEqual(value);
    expect(cache.has(objectKey)).toEqual(true);
    expect(cache.get(objectKey)).toEqual(objectValue);
    expect(cache.size).toBe(2);

    cache.clear();

    expect(cache.has(key)).toEqual(false);
    expect(cache.get(key)).toBeUndefined();
    expect(cache.has(objectKey)).toEqual(false);
    expect(cache.get(objectKey)).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it("should clear cache with dispose", () => {
    const cache = new WeakCache();
    const key = "key";
    const valueDisposeSpy = vi.fn();
    const value = { dispose: valueDisposeSpy, value: "value" };
    const objectKey = { key: "key" };
    const objectValueDisposeSpy = vi.fn();
    const objectValue = { dispose: objectValueDisposeSpy, value: "value" };

    cache.set(key, value);
    cache.set(objectKey, objectValue);

    expect(cache.has(key)).toEqual(true);
    expect(cache.get(key)).toEqual(value);
    expect(cache.has(objectKey)).toEqual(true);
    expect(cache.get(objectKey)).toEqual(objectValue);
    expect(cache.size).toBe(2);

    const clearSpy = vi.fn(x => x.dispose());
    cache.clear(clearSpy);

    expect(clearSpy).toHaveBeenCalledTimes(2);
    expect(cache.has(key)).toEqual(false);
    expect(cache.get(key)).toBeUndefined();
    expect(valueDisposeSpy).toHaveBeenCalledTimes(1);
    expect(cache.has(objectKey)).toEqual(false);
    expect(cache.get(objectKey)).toBeUndefined();
    expect(objectValueDisposeSpy).toHaveBeenCalledTimes(1);
    expect(cache.size).toBe(0);
  });

  it("should ensure value", () => {
    const cache = new WeakCache();
    const key = "key";
    const value = { value: "value" };
    const spy = vi.fn(() => value);

    const result = cache.ensure(key, spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toBe(value);
    expect(cache.get(key)).toBe(value);

    spy.mockClear();

    const result2 = cache.ensure(key, spy);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(result2).toBe(value);
    expect(cache.get(key)).toBe(value);

    cache.delete(key);

    const result3 = cache.ensure(key, spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result3).toBe(value);
    expect(cache.get(key)).toBe(value);
  });

  it("should dispose cache", () => {
    const cache = new WeakCache();
    const key = { key: "key" };
    const value = { value: "value" };
    const objectKey = { key: "key" };
    const objectValue = { value: "value" };

    cache.set(key, value);
    cache.set(objectKey, objectValue);

    expect(cache.has(key)).toEqual(true);
    expect(cache.get(key)).toEqual(value);
    expect(cache.has(objectKey)).toEqual(true);
    expect(cache.get(objectKey)).toEqual(objectValue);
    expect(cache.size).toBe(2);

    cache.dispose();

    expect(cache.has(key)).toEqual(false);
    expect(cache.get(key)).toBeUndefined();
    expect(cache.has(objectKey)).toEqual(false);
    expect(cache.get(objectKey)).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it("should remove from cache if value is garbage collected", async () => {
    const cache = new WeakCache();
    const key = "key";
    const objectKey = { key: "key" };

    cache.set(key, { value: "value" });
    cache.set(objectKey, { value: "value" });

    expect(cache.has(key)).toEqual(true);
    expect(cache.has(objectKey)).toEqual(true);
    expect(cache.size).toBe(2);

    await waitGC();

    expect(cache.has(key)).toEqual(false);
    expect(cache.has(objectKey)).toEqual(false);
    expect(cache.size).toBe(0);
  });

  it("should remove from cache if key is garbage collected", async () => {
    const cache = new WeakCache();

    const value = { value: "value" };

    cache.set({ key: "key" }, value);

    expect(cache.size).toBe(1);

    await waitGC();

    expect(cache.size).toBe(0);
    expect(value).toEqual({ value: "value" });
  });

  it("should remove from cache if key and value are garbage collected", async () => {
    const cache = new WeakCache([
      [{ key: "key" }, { value: "value" }],
      [{ key: "key" }, { value: "value" }],
      [{ key: "key" }, { value: "value" }],
    ]);

    expect(cache.size).toBe(3);

    await waitGC();

    expect(cache.size).toBe(0);
  });

  it("should throw error if value is not an object", () => {
    const cache = new WeakCache();

    expect(() => {
      // @ts-expect-error Testing invalid input
      cache.set("key", "value");
    }).toThrowError();
  });

  it("should get alive values of cache", async () => {
    const value = { value: "value" };
    const cache = new WeakCache<string | { key: string }, { value: string }>([
      ["key", { value: "value" }],
      [{ key: "key" }, { value: "value" }],
      [{ key: "key" }, { value: "value" }],
      [{ key: "key" }, value],
      ["key2", value],
    ]);

    expect(cache.size).toBeGreaterThan(0);
    expect([...cache.values()].length).toBeGreaterThan(0);

    await waitGC();

    expect(cache.size).toBe(1);
    expect([...cache.values()].length).toBe(1);
    expect(cache.values().next().value).toBe(value);
  });
});
