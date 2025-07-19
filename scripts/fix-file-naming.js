#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Convert category name to kebab-case filename
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Update manifest
const manifestPath = join(__dirname, '..', 'generated', 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

// Create mapping of old to new filenames
const filenameMapping = {};

// Update tool implementations to use kebab-case filenames
Object.entries(manifest.tools).forEach(([toolName, toolInfo]) => {
  if (toolInfo.implementation) {
    const parts = toolInfo.implementation.split('/');
    if (parts[0] === 'tools' && parts[1]) {
      const oldFilename = parts[1].split('.js')[0];
      const newFilename = toKebabCase(oldFilename);
      
      if (oldFilename !== newFilename) {
        filenameMapping[oldFilename] = newFilename;
        toolInfo.implementation = `tools/${newFilename}.js#${parts[1].split('#')[1]}`;
      }
    }
  }
});

// Rename actual files in generated/tools directory
const toolsDir = join(__dirname, '..', 'generated', 'tools');
const files = readdirSync(toolsDir);

console.log('Renaming files in generated/tools:');
files.forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const oldName = file.replace(/\.(ts|js)$/, '');
    const newName = toKebabCase(oldName);
    
    if (oldName !== newName) {
      const oldPath = join(toolsDir, file);
      const newPath = join(toolsDir, `${newName}.${file.endsWith('.ts') ? 'ts' : 'js'}`);
      
      console.log(`  ${file} -> ${newName}.${file.endsWith('.ts') ? 'ts' : 'js'}`);
      renameSync(oldPath, newPath);
    }
  }
});

// Update registry.ts to handle the new naming
const registryPath = join(__dirname, '..', 'src', 'tools', 'registry.ts');
let registryContent = readFileSync(registryPath, 'utf-8');

// Update the import path calculation in registry.ts
registryContent = registryContent.replace(
  /const categoryFile = toolInfo\.category\s*\.replace\(\/\\s\/g, ""\)\s*\.toLowerCase\(\);/,
  `const categoryFile = toolInfo.category
              .toLowerCase()
              .replace(/&/g, 'and')
              .replace(/\\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');`
);

// Also need to fix handler name generation for categories with special chars
registryContent = registryContent.replace(
  /const handlerName = `handle\${toolInfo\.category\s*\.split\(" "\)\s*\.map\(\(w\) => w\.charAt\(0\)\.toUpperCase\(\) \+ w\.slice\(1\)\)\s*\.join\(""\)\}Tool`;/g,
  `const handlerName = \`handle\${toolInfo.category
              .split(/[\\s&]+/)
              .filter(w => w.length > 0)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join("")}Tool\`;`
);

writeFileSync(registryPath, registryContent);

// Write updated manifest
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('\n✅ File naming fixed!');
console.log('   - Renamed tool files to kebab-case');
console.log('   - Updated manifest implementation paths');
console.log('   - Updated registry.ts to handle new naming');