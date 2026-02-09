import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: './src/main.ts',
      name: 'voiced-rolls',
      fileName: () => 'main.js',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]'
      }
    },
    sourcemap: true,
    minify: false
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'README.md',
          dest: '.'
        }
      ]
    })
  ]
});
