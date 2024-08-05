# @wopjs/weak-cache

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/wopjs/weak-cache/main/assets/logo.svg">
</p>

[![Docs](https://img.shields.io/badge/Docs-read-%23fdf9f5)](https://wopjs.github.io/weak-cache)
[![Build Status](https://img.shields.io/github/actions/workflow/status/wopjs/weak-cache/build.yml)](https://github.com/wopjs/weak-cache/actions/workflows/build.yml)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/wopjs/weak-cache)](https://coveralls.io/github/wopjs/weak-cache)

[![npm-version](https://img.shields.io/npm/v/@wopjs/weak-cache.svg)](https://www.npmjs.com/package/@wopjs/weak-cache)
[![minified-size](https://img.shields.io/bundlephobia/minzip/weak-cache)](https://bundlephobia.com/package/@wopjs/weak-cache)
[![no-dependencies](https://img.shields.io/badge/dependencies-none-success)](https://bundlejs.com/?q=@wopjs/weak-cache)
[![tree-shakable](https://img.shields.io/badge/tree-shakable-success)](https://bundlejs.com/?q=@wopjs/weak-cache)
[![side-effect-free](https://img.shields.io/badge/side--effect-free-success)](https://bundlejs.com/?q=@wopjs/weak-cache)

WeakCache is like WeakMap but extends support to primitive keys, and with both object keys and object values being weakly referenced.

## Install

```bash
npm add @wopjs/weak-cache
```

## Usage

```ts
import { WeakCache } from "@wopjs/weak-cache";

const cache = new WeakCache();

cache.set("key", { value: "value" });

const objectKey = { key: "key" };

cache.set(key, { value: "value" });

console.log(cache.size); // 2

console.log(cache.get("key")); // { value: "value" }
console.log(cache.get(objectKey)); // { value: "value" }

// ...
// gc()

console.log(cache.size); // 0
```
