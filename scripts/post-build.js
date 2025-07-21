#!/usr/bin/env node
/**
 * Post-build script to restructure build output to match standard MCP pattern
 */
import { existsSync, renameSync, readdirSync, statSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url)).slice(0, -1);
const PROJECT_ROOT = join(__dirname, '..');
const BUILD_DIR = join(PROJECT_ROOT, 'build');
const BUILD_SRC_DIR = join(BUILD_DIR, 'src');

function moveDirectory(from, to) {
  if (!existsSync(from)) return;
  
  if (!existsSync(to)) {
    mkdirSync(to, { recursive: true });
  }
  
  const items = readdirSync(from);
  for (const item of items) {
    const fromPath = join(from, item);
    const toPath = join(to, item);
    
    if (statSync(fromPath).isDirectory()) {
      moveDirectory(fromPath, toPath);
    } else {
      renameSync(fromPath, toPath);
    }
  }
  
  rmSync(from, { recursive: true, force: true });
}

// Move everything from build/src/* to build/*
if (existsSync(BUILD_SRC_DIR)) {
  console.log('📦 Restructuring build output...');
  
  const items = readdirSync(BUILD_SRC_DIR);
  for (const item of items) {
    const fromPath = join(BUILD_SRC_DIR, item);
    const toPath = join(BUILD_DIR, item);
    
    if (existsSync(toPath) && statSync(toPath).isDirectory() && statSync(fromPath).isDirectory()) {
      // Merge directories
      moveDirectory(fromPath, toPath);
    } else {
      // Move file or directory
      renameSync(fromPath, toPath);
    }
  }
  
  // Remove the now-empty src directory
  rmSync(BUILD_SRC_DIR, { recursive: true, force: true });
  
  console.log('✅ Build output restructured to standard MCP pattern');
}