#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Process all TypeScript files in the generated/tools directory
const toolsDir = path.join(__dirname, '..', 'generated', 'tools');
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix axios calls that have $2 - this suggests our regex replacement went wrong
  // Let's try to fix specific known patterns
  const fixes = [
    [/const response = await context\.axios\.patch\(\$2, args\.body\)/g, 'const response = await context.axios.patch(`/companies/${args.id}`, args.body)'],
    [/const response = await context\.axios\.post\(\$2, args\.body\)/g, 'const response = await context.axios.post(`/companies`, args.body)'],
    [/const response = await context\.axios\.put\(\$2, args\.body\)/g, 'const response = await context.axios.put(`/companies/${args.id}`, args.body)'],
  ];
  
  // Apply fixes
  fixes.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  
  // Write back the fixed content
  fs.writeFileSync(filePath, content);
});

console.log('Fixed axios calls');