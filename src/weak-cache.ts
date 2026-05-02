import { getPrimitiveKey, type PrimitiveKey } from "./utils";

export class WeakCache<K extends {}, V extends WeakKey = WeakKey> {
  public get size(): number {
    return this._f.size;
  }

  /** @internal */
  private _f = new Map<PrimitiveKey, WeakRef<V>>();

  /** @internal */
  private _r = new FinalizationRegistry<PrimitiveKey>((key) => {
    const ref = this._f.get(key);
    if (ref) {
      this._r.unregister(ref);
      this._f.delete(key);
    }
  });

  public constructor(iterable?: Iterable<readonly [K, V]> | null | undefined) {
    if (iterable) {
      for (const [k, v] of iterable) {
        this.set(k, v);
      }
    }
  }

  public clear(dispose?: (value: V) => void): void {
    for (const ref of this._f.values()) {
      this._r.unregister(ref);
      if (dispose) {
        const value = ref.deref();
        if (value) dispose(value);
      }
    }
    this._f.clear();
  }

  /**
   * Removes the specified element from the WeakMap.
   * @returns true if the element was successfully removed, or false if it was not present.
   */
  public delete(key: K): boolean {
    const k = getPrimitiveKey(key);
    const ref = this._f.get(k);
    if (ref) {
      this._r.unregister(ref);
      return this._f.delete(k);
    }
    return false;
  }

  public dispose(): void {
    this.clear();
  }

  /**
   *
   * @param key
   * @param create
   */
  public ensure(key: K, create: () => V): V {
    let value = this.get(key);
    if (!value) {
      this.set(key, (value = create()));
    }
    return value;
  }

  /**
   * @returns a specified element.
   */
  public get(key: K): undefined | V {
    return this._f.get(getPrimitiveKey(key))?.deref();
  }

  /**
   * @returns a boolean indicating whether an element with the specified key exists or not.
   */
  public has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Adds a new element with a specified key and value.
   * @param key Must be an object or symbol.
   * @returns this
   */
  public set(key: K, value: V): this {
    const k = getPrimitiveKey(key);
    const ref = new WeakRef(value);
    this._f.set(k, ref);
    this._r.register(value, k, ref);
    if (!Object.is(k, key)) {
      this._r.register(key, k, ref);
    }
    return this;
  }

  public *values(): IterableIterator<V> {
    for (const ref of this._f.values()) {
      const value = ref.deref();
      if (value) {
        yield value;
      }
    }
  }
}
