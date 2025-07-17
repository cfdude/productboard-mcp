#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to convert invalid function names to camelCase
function toCamelCase(name) {
  return name
    .replace(/[\s&]+/g, ' ')  // Replace spaces and & with single space
    .split(' ')
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

// Function to get the expected function name from file name
function getExpectedFunctionName(filename) {
  const baseName = path.basename(filename, '.ts');
  const words = baseName.split('-');
  const setupName = 'setup' + words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('') + 'Tools';
  
  const handleName = 'handle' + words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('') + 'Tool';
  
  return { setupName, handleName };
}

// Process all TypeScript files in the generated/tools directory
const toolsDir = path.join(__dirname, '..', 'generated', 'tools');
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const { setupName, handleName } = getExpectedFunctionName(file);
  
  // Fix setup function name
  const setupRegex = /export function setup([^(]+)Tools\(\)/;
  const setupMatch = content.match(setupRegex);
  if (setupMatch) {
    const oldName = setupMatch[1];
    if (oldName.includes(' ') || oldName.includes('&')) {
      console.log(`${file}: Fixing setup function name from "${setupMatch[0]}" to "export function ${setupName}()"`);
      content = content.replace(setupRegex, `export function ${setupName}()`);
    }
  }
  
  // Fix handle function name
  const handleRegex = /export async function handle([^(]+)Tool\(/;
  const handleMatch = content.match(handleRegex);
  if (handleMatch) {
    const oldName = handleMatch[1];
    if (oldName.includes(' ') || oldName.includes('&')) {
      console.log(`${file}: Fixing handle function name from "${handleMatch[0]}" to "export async function ${handleName}("`);
      content = content.replace(handleRegex, `export async function ${handleName}(`);
    }
  }
  
  // Fix any body variable references
  content = content.replace(/\bconst response = await context\.axios\.(post|put|patch)\([^,]+,\s*body\)/g, 
    'const response = await context.axios.$1($2, args.body)');
  
  // Fix property names with dots that aren't quoted
  content = content.replace(/(\s+)([a-zA-Z]+\.[a-zA-Z]+):\s*\{/g, '$1"$2": {');
  
  // Write back the fixed content
  fs.writeFileSync(filePath, content);
});

console.log('Fixed all function names in generated tools');