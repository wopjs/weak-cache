# weak-cache

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/crimx/weak-cache/main/assets/logo.svg">
</p>

[![Docs](https://img.shields.io/badge/Docs-read-%23fdf9f5)](https://crimx.github.io/weak-cache)
[![Build Status](https://github.com/crimx/weak-cache/actions/workflows/build.yml/badge.svg)](https://github.com/crimx/weak-cache/actions/workflows/build.yml)
[![Coverage Status](https://img.shields.io/codeclimate/coverage/crimx/weak-cache)](https://codeclimate.com/github/crimx/weak-cache)

[![npm-version](https://img.shields.io/npm/v/weak-cache.svg)](https://www.npmjs.com/package/weak-cache)
[![minified-size](https://img.shields.io/bundlephobia/minzip/weak-cache)](https://bundlephobia.com/package/weak-cache)
[![no-dependencies](https://img.shields.io/badge/dependencies-none-success)](https://bundlejs.com/?q=weak-cache)
[![tree-shakable](https://img.shields.io/badge/tree-shakable-success)](https://bundlejs.com/?q=weak-cache)
[![side-effect-free](https://img.shields.io/badge/side--effect-free-success)](https://bundlejs.com/?q=weak-cache)

WeakCache is like WeakMap but extends support to primitive keys, and with both object keys and object values being weakly referenced.

## Install

```bash
npm add weak-cache
```

## Usage

```ts
import { WeakCache } from "weak-cache";

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
