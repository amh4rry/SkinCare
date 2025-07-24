#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting custom build process...');

// Use npx to run vite build to avoid permission issues
const buildProcess = spawn('npx', ['vite', 'build'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build completed successfully!');
    process.exit(0);
  } else {
    console.error('❌ Build failed with code:', code);
    process.exit(1);
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ Build error:', error);
  process.exit(1);
});
