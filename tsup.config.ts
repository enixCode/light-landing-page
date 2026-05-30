import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  // React stays a peer dependency, never bundled.
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  // Preserve the "use client" directive so the component works in RSC consumers.
  banner: { js: '"use client";' },
});
