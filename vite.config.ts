import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

import manifest from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@pages': path.resolve(__dirname, 'src/popup/components/pages'),
        '@shared': path.resolve(__dirname, 'src/popup/components/shared'),
      },
    },
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },
    plugins: [crx({ manifest }), vue()],
  };
});
