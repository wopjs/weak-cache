import { getPrimitiveKey, isObject, type PrimitiveKey } from "./utils";

export class WeakCache<K, V extends WeakKey = WeakKey> {
  public get size(): number {
    return this.#map.size;
  }
  #map = new Map<PrimitiveKey, WeakRef<V>>();

  #registry = new FinalizationRegistry<PrimitiveKey>(key => {
    const ref = this.#map.get(key);
    if (ref) {
      this.#registry.unregister(ref);
      this.#map.delete(key);
    }
  });

  public constructor(iterable?: Iterable<readonly [K, V]> | null | undefined) {
    if (iterable) {
      for (const [k, v] of iterable) {
        this.set(k, v);
      }
    }
  }

  public clear(): void {
    for (const ref of this.#map.values()) {
      this.#registry.unregister(ref);
    }
    this.#map.clear();
  }

  /**
   * Removes the specified element from the WeakMap.
   * @returns true if the element was successfully removed, or false if it was not present.
   */
  public delete(key: K): boolean {
    const k = getPrimitiveKey(key);
    const ref = this.#map.get(k);
    if (ref) {
      this.#registry.unregister(ref);
      return this.#map.delete(k);
    }
    return false;
  }

  public dispose(): void {
    this.clear();
  }

  /**
   * @returns a specified element.
   */
  public get(key: K): undefined | V {
    return this.#map.get(getPrimitiveKey(key))?.deref();
  }

  /**
   * @returns a boolean indicating whether an element with the specified key exists or not.
   */
  public has(key: K): boolean {
    return this.#map.has(getPrimitiveKey(key));
  }

  /**
   * Adds a new element with a specified key and value.
   * @param key Must be an object or symbol.
   */
  public set(key: K, value: V): this {
    const k = getPrimitiveKey(key);
    const ref = new WeakRef(value);
    this.#map.set(k, ref);
    this.#registry.register(value, k, ref);
    if (isObject(key)) {
      this.#registry.register(key, k, ref);
    }
    return this;
  }
}
