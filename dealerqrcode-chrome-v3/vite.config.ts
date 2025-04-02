import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { copyFileSync } from 'fs';

// Custom plugin to copy manifest
const copyManifest = () => {
  return {
    name: 'copy-manifest',
    closeBundle: () => {
      // Copy manifest
      copyFileSync('manifest.json', 'dist/manifest.json');
    }
  }
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    copyManifest()
  ],
  build: {
    minify: false, // Disable minification for easier debugging
    sourcemap: true, // Enable sourcemaps for debugging
    rollupOptions: {
      input: {
        contentScript: resolve(__dirname, 'src/contentScript.tsx'),
        background: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist'
  }
});
