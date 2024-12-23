# @wopjs/weak-cache

[![Docs](https://img.shields.io/badge/Docs-read-%23fdf9f5)](https://wopjs.github.io/weak-cache)
[![Build Status](https://github.com/wopjs/weak-cache/actions/workflows/build.yml/badge.svg)](https://github.com/wopjs/weak-cache/actions/workflows/build.yml)
[![npm-version](https://img.shields.io/npm/v/@wopjs/weak-cache.svg)](https://www.npmjs.com/package/@wopjs/weak-cache)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/wopjs/weak-cache)](https://coveralls.io/github/wopjs/weak-cache)
[![minified-size](https://img.shields.io/bundlephobia/minzip/@wopjs/weak-cache)](https://bundlephobia.com/package/@wopjs/weak-cache)

WeakCache is like WeakMap but extends support to primitive keys, and with both object keys and object values being weakly referenced.

## Install

```
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

## Publish New Version

You can use [npm version](https://docs.npmjs.com/cli/v10/commands/npm-version) to bump version.

```
npm version patch
```

Push the tag to remote and CI will publish the new version to npm.

```
git push --follow-tags
```

### CI Publish

If you want to publish the package in CI, you need to set the `NPM_TOKEN` secrets [in GitHub repository settings](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository). See how to [create a NPM access token](https://docs.npmjs.com/creating-and-viewing-access-tokens).
