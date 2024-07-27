import glsl from "vite-plugin-glsl";

export default {
  root: "src",
  plugins: [glsl()],
  server: {
    cors: "*",
    hmr: {},
  },
  build: {
    minify: true,
    outDir: "../src/dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "/js/index.js",
      output: {
        format: "umd",
        entryFileNames: "index.js",
        compact: true,
      },
    },
  },
  envDir: "../",
};
