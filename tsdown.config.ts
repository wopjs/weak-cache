import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
  },
  outputOptions: {
    name: "weak_cache",
  },
  format: ["cjs", "esm", "umd"],
  minify: Boolean(process.env.MINIFY),
  sourcemap: false,
  target: "esnext",
  treeshake: true,
});
