import { rollup } from "rollup";

const bundle = await rollup({
  input: ["dist/index.mjs"],
});

await bundle.write({
  file: "dist/index.umd.js",
  format: "umd",
  name: "weak-cache",
});
