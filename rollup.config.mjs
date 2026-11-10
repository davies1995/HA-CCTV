import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/cctv-dashboard.js",
  output: {
    file: "dist/cctv-dashboard.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    terser({
      format: {
        comments: false,
      },
    }),
  ],
};
