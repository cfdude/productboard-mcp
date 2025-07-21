#!/usr/bin/env node
/**
 * Remove 'productboard_' prefix from tool names throughout the codebase
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Files to exclude from processing
const EXCLUDE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '*.lock',
  '*.log'
];

// Update a single file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Different patterns for different file types
    if (filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.mjs') || filePath.endsWith('.cjs')) {
      // Tool names in strings
      content = content.replace(/["']productboard_([^"']+)["']/g, '"$1"');
      content = content.replace(/`([^`]+)`/g, '`$1`');
      
      // Case statements
      content = content.replace(/case\s+["']productboard_([^"']+)["']:/g, 'case "$1":');
      
      // Object keys
      content = content.replace(/productboard_(\w+):\s*{/g, '$1: {');
    }
    
    if (filePath.endsWith('.json')) {
      // JSON keys and values
      content = content.replace(/"([^"]+)":/g, '"$1":');
      content = content.replace(/:\s*"([^"]+)"/g, ': "$1"');
    }
    
    if (filePath.endsWith('.md')) {
      // Markdown code blocks and inline code
      content = content.replace(/`([^`]+)`/g, '`$1`');
      content = content.replace(/^productboard_(\w+)/gm, '$1');
    }
    
    // Save if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Updated: ${path.relative(PROJECT_ROOT, filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Find all files to process
function findFiles() {
  const patterns = ['**/*.ts', '**/*.js', '**/*.mjs', '**/*.cjs', '**/*.json', '**/*.md'];
  const files = [];
  
  for (const pattern of patterns) {
    const matches = glob.sync(pattern, {
      cwd: PROJECT_ROOT,
      ignore: EXCLUDE_PATTERNS,
      absolute: true
    });
    files.push(...matches);
  }
  
  return [...new Set(files)]; // Remove duplicates
}

// Main function
async function main() {
  console.log('🔍 Searching for files containing "productboard_" prefix...\n');
  
  const files = findFiles();
  console.log(`Found ${files.length} files to check.\n`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    if (updateFile(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n✅ Complete! Updated ${updatedCount} files.`);
  
  // Special note about files that might need manual review
  console.log('\n⚠️  Please manually review:');
  console.log('  - API endpoint calls (should keep "productboard" in URLs)');
  console.log('  - Documentation that refers to the Productboard product name');
  console.log('  - Any hardcoded API keys or identifiers');
}

// Run the script
main().catch(console.error);