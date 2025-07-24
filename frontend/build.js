#!/usr/bin/env node

import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Vercel-compatible build process...');

async function buildApp() {
  try {
    console.log('📦 Building with Vite API...');
    
    await build({
      plugins: [react()],
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              mui: ['@mui/material', '@mui/icons-material'],
            },
          },
        },
      },
      root: __dirname,
    });
    
    console.log('✅ Build completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildApp();
