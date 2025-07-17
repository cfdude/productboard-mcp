#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Process all TypeScript files in the generated/tools directory
const toolsDir = path.join(__dirname, '..', 'generated', 'tools');
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix function names with spaces and special characters
  content = content.replace(
    /export function setup([^(]+)Tools\(\)/g,
    (match, name) => {
      const fixedName = name.replace(/[\s&]+/g, ' ').split(' ').map((word, i) => 
        i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');
      return `export function setup${fixedName}Tools()`;
    }
  );
  
  content = content.replace(
    /export async function handle([^(]+)Tool\(/g,
    (match, name) => {
      const fixedName = name.replace(/[\s&]+/g, ' ').split(' ').map((word, i) => 
        i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');
      return `export async function handle${fixedName}Tool(`;
    }
  );
  
  // Fix property names with dots (add quotes)
  content = content.replace(
    /(\s+)([a-zA-Z]+\.[a-zA-Z]+(?:\.[a-zA-Z]+)*): \{/g,
    '$1"$2": {'
  );
  
  // Fix body variable references
  content = content.replace(/\bbody\b/g, 'args.body');
  
  console.log(`Fixed: ${file}`);
  
  // Write back the fixed content
  fs.writeFileSync(filePath, content);
});

console.log('Fixed all function names and syntax issues');