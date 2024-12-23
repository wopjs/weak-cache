import { getPrimitiveKey, type PrimitiveKey } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class WeakCache<K extends {}, V extends WeakKey = WeakKey> {
  public get size(): number {
    return this._refs_.size;
  }

  /** @internal */
  private _refs_ = new Map<PrimitiveKey, WeakRef<V>>();

  /** @internal */
  private _registry_ = new FinalizationRegistry<PrimitiveKey>(key => {
    const ref = this._refs_.get(key);
    if (ref) {
      this._registry_.unregister(ref);
      this._refs_.delete(key);
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
    for (const ref of this._refs_.values()) {
      this._registry_.unregister(ref);
    }
    this._refs_.clear();
  }

  /**
   * Removes the specified element from the WeakMap.
   * @returns true if the element was successfully removed, or false if it was not present.
   */
  public delete(key: K): boolean {
    const k = getPrimitiveKey(key);
    const ref = this._refs_.get(k);
    if (ref) {
      this._registry_.unregister(ref);
      return this._refs_.delete(k);
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
    return this._refs_.get(getPrimitiveKey(key))?.deref();
  }

  /**
   * @returns a boolean indicating whether an element with the specified key exists or not.
   */
  public has(key: K): boolean {
    return this._refs_.has(getPrimitiveKey(key));
  }

  /**
   * Adds a new element with a specified key and value.
   * @param key Must be an object or symbol.
   */
  public set(key: K, value: V): this {
    const k = getPrimitiveKey(key);
    const ref = new WeakRef(value);
    this._refs_.set(k, ref);
    this._registry_.register(value, k, ref);
    if (!Object.is(k, key)) {
      this._registry_.register(key, k, ref);
    }
    return this;
  }
}
