#!/usr/bin/env node

console.log('🚀 Starting fallback build process...');

// Fallback build using webpack-like approach
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple build process
async function simpleBuild() {
  try {
    console.log('📁 Creating dist directory...');
    const distDir = join(__dirname, 'dist');
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }
    
    console.log('📄 Copying index.html...');
    const indexHtml = readFileSync(join(__dirname, 'index.html'), 'utf8');
    writeFileSync(join(distDir, 'index.html'), indexHtml);
    
    console.log('📁 Copying public assets...');
    const publicDir = join(__dirname, 'public');
    if (existsSync(publicDir)) {
      copyDirectory(publicDir, distDir);
    }
    
    console.log('⚠️  This is a fallback build. For full optimization, fix the main build process.');
    console.log('✅ Fallback build completed!');
    
  } catch (error) {
    console.error('❌ Fallback build failed:', error);
    process.exit(1);
  }
}

function copyDirectory(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const items = readdirSync(src);
  
  for (const item of items) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);
    
    if (statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

simpleBuild();
