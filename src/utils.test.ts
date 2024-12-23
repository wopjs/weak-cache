import { describe, expect, it } from "vitest";
import { getPrimitiveKey } from "./utils";

describe("getPrimitiveKey", () => {
  it("should return primitive value for primitive key", () => {
    expect(getPrimitiveKey(undefined)).toEqual(undefined);
    expect(getPrimitiveKey(null)).toEqual(null);
    expect(getPrimitiveKey(true)).toEqual(true);
    expect(getPrimitiveKey(false)).toEqual(false);
    expect(getPrimitiveKey("string")).toEqual("string");
    expect(getPrimitiveKey(0)).toEqual(0);
    const symbol = Symbol();
    expect(getPrimitiveKey(symbol)).toEqual(symbol);
  });

  it("should return symbol for object key", () => {
    const key = {};
    const symbol = getPrimitiveKey(key);
    expect(typeof symbol).toEqual("symbol");
    expect(getPrimitiveKey(key)).toEqual(symbol);
  });

  it("should return symbol for object key without prototype", () => {
    const key = Object.create(null);
    key.key = "key";
    const symbol = getPrimitiveKey(key);
    expect(typeof symbol).toEqual("symbol");
    expect(getPrimitiveKey(key)).toEqual(symbol);
    expect(getPrimitiveKey(key)).toEqual(getPrimitiveKey(key));
  });
});
